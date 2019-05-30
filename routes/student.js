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
  students.id = ++id;
  (async function() {
    for (let i = 0; i < students.course.length; i++) {
      let courses = await _getOneCourse(students.course[i]);
      students.course[i] = courses;
    }
    db.collection('student').insertOne(students, (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar Um Novo estudante", err);
        res.status(500).send("Erro ao Criar Um Novo estudante");
      } else {
        res.status(201).send("estudante Cadastrado com Sucesso.");
      }
    });
  })();
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
  students.id = req.params.id;
  if(students =={}){
    res.status(400).send("Solicitação não autorizada");
  }else{
    (async function() {
      for (let i = 0; i < students.course.length; i++) {
        let courses = await _getOneCourse(students.course[i]);
        students.course[i] = courses;
      }
      db.collection('student').insertOne(students, (err, result) => {
        if (err) {
          console.error("Erro ao Criar Um Novo Curso", err);
          res.status(500).send("Erro ao Criar Um Novo Curso");
        } else {
          res.status(201).send("Curso Cadastrado com Sucesso.");
        }
      });
    })();
  }
});

//-------------------------------DELETE--------------------------------


app.delete('/', function (req, res) {
  db.collection('teacher').remove( {}, function(err, info){
    if(err){
      console.error("Ocorreu um erro ao deletar os usuários da coleção");
      res.status(500);
    }else{
      let n_removed = info.result.n;
      if(n_removed > 0){
        console.log("INF: Todos os usuários" + n_removed + "foram removidos");
        res.status(204).send("Todos os usuários foram removidos com sucesso");
      }else{
        console.log("Nenhum usuário foi removido");
        res.status(404).send("Nenhum usuário foi removido");
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
        res.status(204)
        res.send("Todos os professores foram removidos com sucesso");
        console.log("INF: Todos os professores" + n_removed + "foram removidos");
      }else{
        console.log("Nenhum professores foi removido");
        res.status(404).send("Nenhum professores foi removido");
      } 
    } 
  });
})





//------------------------EXPORT------------------------------

module.exports = app;