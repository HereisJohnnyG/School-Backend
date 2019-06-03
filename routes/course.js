const express = require('express');
const app = express.Router();
const app2 = require('./teacher.js');
const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";
var db;

var id = 0;

mongoClient.connect(mdbURL, {useNewUrlParser: true}, (err, database) => {
  if(err){
    console.error("Ocorreu um erro ao conectar ao MongoDB");
    send.status(500); //Internal server error
  }
  else{
    db = database.db('trainee-prominas');
    db.collection('course').find({}).toArray((err, course) =>{id = course.length});
  }
})



course = [];
//-------------------------------GET--------------------------------

app.get('/', function (req, res) {
  db.collection('course').find({'status':1}, {projection: {'_id': 0, 'status':0, 'teacher._id': 0, 'teacher.status': 0}}).toArray( (err, courses) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection Course");
      send.status(500);
    }else res.send(courses);
    
  });
});


app.get('/:id', function (req, res) {
  let id = parseInt(req.params.id);
  db.collection('course').find({"id": id, "status": 1}, 
    {projection: {'_id': 0, 'status':0, 'teacher.status': 0}}).
    toArray( (err, courses) => {
      if(err){
        console.error("Ocorreu um erro ao conectar a collection Course");
        send.status(500);
      }else{
        if(courses == []){
          res.status(404).send("Curso não encontrado");
        }else res.send(courses);
      } 
    
  });
});

//-------------------------------POST--------------------------------



app.post('/', function(req, res) {
  course = {};
  if(req.body.name && req.body.city){
    
    course.status = 1;
    course.name = req.body.name;
    course.city = req.body.city
    course.period = parseInt(course.period) || 8;
    course.id = ++id;

    let curso_var = req.body.teacher;
    console.log("----------",curso_var);
    course.teacher = [];
    (async function() {
      for (let i = 0; i < curso_var.length; i++) {
        let teachers = await search_teacher(curso_var[i]);
        if(teachers != null){
          
          course.teacher.push(teachers);
        }
      }
      console.log(course);
      db.collection('course').insertOne(course, (err, result) => {
        if (err) {
          console.error("Erro ao Criar Um Novo Curso", err);
          res.status(500).send("Erro ao Criar Um Novo Curso");
        } else{
          console.log('result',result);
          if(course.teacher.length < curso_var.length){
            res.status(201).send("Curso cadastrado mas informação de um id de professor digitado não exite")
          }else res.status(201).send("Curso Cadastrado com Sucesso.");
        }
      });
    })();
  }else res.status(403).send("Os dados devem ser preenchidos");
});

function search_teacher(id) {
  return new Promise((resolve, reject) => {
      db.collection('teacher').findOne({ "id" : id, "status": 1}, (err, teacher) => {
      if (err)
        return reject(err);
      else
        return resolve(teacher);
    });
  });
};

//------------------------PUT------------------------------


app.put('/:id', function (req, res) {
  courses = {};
  courses.name = req.body.name;
  courses.teacher = [];
  courses.city = req.body.city;
  teacher_var = req.body.teacher

  console.log(courses.name, courses.city)  ;
  if(courses.name || courses.city){

    courses.id = parseInt(req.params.id);
    course.status = 1;
    let ide = parseInt(req.params.id);
    if(courses =="{}"){
      res.status(400).send("Solicitação não autorizada");
    }else{
      (async function() {
        for (let i = 0; i < teacher_var.length; i++) {
          let teachers = await search_teacher(teacher_var[i]);
          if(teachers != null){
            courses.teacher.push(teachers);
          }
        }
        db.collection('course').updateOne({"id": ide}, { $set: courses }, (err, result) => {
          if (err) {
            console.error("Erro ao Criar Um Novo Curso", err);
            res.status(201).send("Erro ao Criar Um Novo Curso");
          } else {
            console.log('-------------------',courses);
            db.collection('student').updateMany(
              { "course.id": courses.id }, 
              { $set: { "course.$": courses } }, 
              function(err_course, results){
                if(err_course){
                  res.send("Erro na inserção do curso");
                }          
                else if(results.matchedCount >= 0){
                  res.send("curso modificado com sucesso");
                }
                else{
                  res.send('Erro na modificação');
                }
            })
            //res.status(201).send("Curso modificado com Sucesso.");
          }
        });
      })();
    }
  }else res.status(403).send("Os dados devem ser preenchidos");
});




//-------------------------------DELETE--------------------------------
app.delete('/', function (req, res) {
   res.status(204).send("Função desativada");
  // db.collection('course').remove( {}, function(err, info){
  //   if(err){
  //     console.error("Ocorreu um erro ao deletar os usuários da coleção");
  //     res.status(500);
  //   }else{
  //     let n_removed = info.result.n;
  //     if(n_removed > 0){
  //       console.log("INF: Todos os usuários" + n_removed + "foram removidos");
  //       res.status(200).send("Todos os usuários foram removidos com sucesso");
  //     }else{
  //       console.log("Nenhum usuário foi removido");
  //       res.status(204).send("Nenhum usuário foi removido");
  //     } 
  //   } 
  // });
});

app.delete('/:id', function (req, res) {
  let id = parseInt(req.params.id);

  db.collection('course').findOneAndUpdate(
    {"id": id, "status": 1}, 
    {$set: {status: 0}}, 
    function(err, info){
      if(err){
        console.error("Ocorreu um erro ao deletar o curso da coleção");
        res.status(500);
      }else{
        if(err){
          console.error("Ocorreu um erro ao deletar o curso da coleção");
          res.status(500);
        }else
        if(info.value == null) {
          res.status(204).send("Não foi possivel encontrar o curso")
        }else{
          
          db.collection('student').updateMany({}, 
            {$pull: {course: {"id": id}}});
          
          res.send("Usuário excluido com sucesso");
        }
      } 
  });
})
//------------------------Functions------------------------------

function search_ID(ide) {
  let result = course.filter ( (s) => {return (s.id == ide)} );
  return(result);
}

//------------------------EXPORT------------------------------

module.exports = {app, search_ID};