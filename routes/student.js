const express = require('express');
const app = express.Router();
const _curso = require('./course.js');
const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";
var db, id;

mongoClient.connect(mdbURL, {useNewUrlParser: true}, (err, database) => {
  if(err){
    console.error("Ocorreu um erro ao conectar ao MongoDB");
    send.status(500); //Internal server error
  }
  else{
    db = database.db('trainee-prominas');
    db.collection('student').find({}).toArray((err, student) =>{id = student.length});
  }
});


//-------------------------------GET--------------------------------
app.get('/', function (req, res) {
  db.collection('student').find({status:1}, 
    {projection: {"_id": 0, "status": 0, "course._id": 0, "course.status": 0, "course.teacher._id": 0, "course.teacher.status": 0}}).toArray( (err, estudantes) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection Student");
      send.status(500);
    }else res.send(estudantes);
    
  });
});

app.get('/:id', function (req, res) {
  let id = parseInt(req.params.id);
  db.collection('student').find({"id": id, status:1}, 
    {projection: {"_id": 0, "status": 0, "course._id": 0, "course.status": 0, "course.teacher._id": 0, "course.teacher.status": 0}}).toArray( (err, estudantes) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection Student");
      send.status(500);
    }else{
      if(estudantes == []){
        res.status(404).send("Usuário não encontrado");
      }else res.send(estudantes);
    } 
    
  });
});


//-------------------------------POST--------------------------------

app.post('/', function(req, res) {
  let students = {};
  students.name = req.body.name;
  students.lastname = req.body.lastname;
  students.age = req.body.age;
  students.course = [];
  let student_temp = req.body.course;
  
  if(students.name && students.lastname && students.age && req.body.course){
    console.log('-----------');
    students.status = 1;
    students.id = ++id;
    (async function() {
      for (let i = 0; i < student_temp.length; i++) {
        let courses = await _getOneCourse(student_temp[i]);
        if(courses != null){
          console.log(courses);
          students.course.push(courses);
        }
        //students.course[i] = courses;
      }
      if(students.course.length > 0){
          db.collection('student').insertOne(students, (err, result) => {
          if (err) {
            console.error("Erro ao cadastrar um novo estudante", err);
            res.status(500).send("Erro ao criar Um novo estudante");
          } else {
            res.status(200).send("Estudante Cadastrado com Sucesso.");
          }
        });
      }else res.status(201).send("Erro ao criar Um novo estudante, curso invalido");
      
    })();
  }else{res.status(500).send("Erro ao Criar Um Novo estudante");}
});

const _getOneCourse = function(id) {
  return new Promise((resolve, reject) => {
      db.collection('course').findOne({ "id" : id, "status": 1}, (err, course) => {
      if (err)
        return reject(err);
      else
        return resolve(course);
    });
  });
};

//-------------------------------PUT--------------------------------

app.put('/:id', function (req, res) {

  let students = {};
  students.name = req.body.name;
  students.lastname = req.body.lastname;
  students.age = req.body.age;
  students.course = [];
  let student_temp = req.body.course;


  if(students.name && students.lastname && students.age && student_temp){
  let id = parseInt(req.params.id);
  students.id = parseInt(req.params.id);
  let ide = parseInt(req.params.id);
  if(students =={}){
    res.status(400).send("Solicitação não autorizada");
  }else{
    (async function() {
      for (let i = 0; i < student_temp.length; i++) {
        let courses = await _getOneCourse(student_temp[i]);
        if(courses != null){
          students.course.push(courses);
        }
        //students.course[i] = courses;
      }
      if(students.course.length > 0){
        db.collection('student').updateOne({"id": ide, "status": 1}, { $set: students }, (err, result) => {
          if (err) {
            console.error("Erro ao editar Curso", err);
            res.status(500).send("Erro ao editar Curso");
          } else {
            if(result.matchedCount > 0) res.status(201).send("Curso editado com Sucesso.");
            else res.status(404).send("Estudante não encontrado");
          }
        });
      }else{
        res.status(400).send("Necessário cadastrar um curso para o aluno");
      }
    })();
  }
}
});

//-------------------------------DELETE--------------------------------


app.delete('/', function (req, res) {
  // res.status(204).send("Função desativada");
  db.collection('student').remove( {}, function(err, info){
    if(err){
      console.error("Ocorreu um erro ao deletar os usuários da coleção");
      res.status(500);
    }else{
      let n_removed = info.result.n;
      if(n_removed > 0){
        console.log("INF: Todos os usuários" + n_removed + "foram removidos");
        res.status(200).send("Todos os usuários foram removidos com sucesso");
      }else{
        console.log("Nenhum usuário foi removido");
        res.status(204).send("Nenhum usuário foi removido");
      } 
    } 
  });
});

app.delete('/:id', function (req, res) {
  let id = parseInt(req.params.id);

  db.collection('student').findOneAndUpdate({"id": id, "status": 1}, {$set: {status: 0}}, function (err, results){ 
    if(err){
      console.error("Ocorreu um erro ao deletar os usuários da coleção");
      res.status(500);
    }else
    if(results.value == null) {
      res.status(204).send("Não foi possivel encontrar o usuário")
    }else res.send("Usuário excluido com sucesso");
  });

});





//------------------------EXPORT------------------------------

module.exports = app;