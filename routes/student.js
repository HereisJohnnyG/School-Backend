const express = require('express');
const app = express.Router();
const _curso = require('./course.js');
const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";
var db;

mongoClient.connect(mdbURL, {native_parser:true}, (err, database) => {
  if(err){
    console.error("Ocorreu um erro ao conectar ao MongoDB");
    send.status(500); //Internal server error
  }
  else{
    db = database.db('trainee-prominas');
  }
});



var id = 0;

var students = [];
//-------------------------------GET--------------------------------
app.get('/', function (req, res) {
  db.collection('student').find({}).toArray( (err, estudantes) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection Student");
      send.status(500);
    }else res.send(estudantes);
    
  });
});

app.get('/:id', function (req, res) {
  let id = parseInt(req.params.id);
  db.collection('student').find({"id": id}).toArray( (err, estudantes) => {
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
  let students = req.body;
  if(students.name && students.lastname && students.age && students.course){
    students.status = 1;
    students.id = ++id;
    (async function() {
      for (let i = 0; i < students.course.length; i++) {
        let courses = await _getOneCourse(students.course[i]);
        students.course[i] = courses;
      }
      if(students.course.length != 0){
          db.collection('student').insertOne(students, (err, result) => {
          if (err) {
            console.error("Erro ao cadastrar um novo estudante", err);
            res.status(500).send("Erro ao criar Um novo estudante");
          } else {
            res.status(201).send("Estudante Cadastrado com Sucesso.");
          }
        });
      }else{
        res.status(500).send("Erro ao Criar Um Novo estudante");
    }
    })();
  }
});

const _getOneCourse = function(id) {
  return new Promise((resolve, reject) => {
      db.collection('course').findOne({ "id" : id}, (err, course) => {
      if (err)
        return reject(err);
      else
        return resolve(course);
    });
  });
};

//-------------------------------PUT--------------------------------

app.put('/:id', function (req, res) {

  let students = req.body;
  if(students.name && students.lastname && students.age && students.course){
  let id = parseInt(req.params.id);
  students.id = parseInt(req.params.id);
  let ide = parseInt(req.params.id);
  if(students =={}){
    res.status(400).send("Solicitação não autorizada");
  }else{
    (async function() {
      if(students.course.length > 0){
      for (let i = 0; i < students.course.length; i++) {
        let courses = await _getOneCourse(students.course[i]);
        students.course[i] = courses;
      }
      db.collection('student').updateOne({"id": ide}, { $set: students }, (err, result) => {
        if (err) {
          console.error("Erro ao editar Curso", err);
          res.status(500).send("Erro ao editar Curso");
        } else {
          res.status(201).send("Curso editado com Sucesso.");
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

  db.collection('student').remove( {"id": id}, true, function(err, info){
    if(err){
      console.error("Ocorreu um erro ao deletar os professores da coleção");
      res.status(500);
    }else{
      let n_removed = info.result.n;
      if(n_removed > 0){
        res.status(200)
        res.send("Todos os professores foram removidos com sucesso");
        console.log("INF: Todos os professores" + n_removed + "foram removidos");
      }else{
        console.log("Nenhum professores foi removido");
        res.status(204).send("Nenhum professores foi removido");
      } 
    } 
  });
})





//------------------------EXPORT------------------------------

module.exports = app;