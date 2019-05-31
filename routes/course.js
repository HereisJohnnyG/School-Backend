const express = require('express');
const app = express.Router();
const app2 = require('./teacher.js');
const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";
var db;

mongoClient.connect(mdbURL, {useNewUrlParser: true}, (err, database) => {
  if(err){
    console.error("Ocorreu um erro ao conectar ao MongoDB");
    send.status(500); //Internal server error
  }
  else{
    db = database.db('trainee-prominas');
  }
})

var id = 0;

course = [];
//-------------------------------GET--------------------------------

app.get('/', function (req, res) {
  db.collection('course').find({}, {projection: {_id: 0, id: 1, name: 1, period:1, teacher:1, city:1}}).toArray( (err, courses) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection Course");
      send.status(500);
    }else res.send(courses);
    
  });
});


app.get('/:id', function (req, res) {
  let id = parseInt(req.params.id);
  db.collection('course').find({"id": id}, {projection: {_id: 0, id: 1, name: 1, period:1, teacher:1, city:1}}).toArray( (err, courses) => {
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
  let course = req.body;  
  if(course.name && course.teacher && course.city){
    course.status = 1;
    course.period = parseInt(course.period) || 8;
    course.id = ++id;
    (async function() {
      for (let i = 0; i < course.teacher.length; i++) {
        let teachers = await _getOneTeacher(course.teacher[i]);
        course.teacher[i] = teachers;
      }
      db.collection('course').insertOne(course, (err, result) => {
        if (err) {
          console.error("Erro ao Criar Um Novo Curso", err);
          res.status(500).send("Erro ao Criar Um Novo Curso");
        } else {
          res.status(201).send("Curso Cadastrado com Sucesso.");
        }
      });
    })();
  }else res.status(403).send("Os dados devem ser preenchidos");
});

const _getOneTeacher = function(id) {
  return new Promise((resolve, reject) => {
      db.collection('teacher').findOne({ "id" : id}, (err, teacher) => {
      if (err)
        return reject(err);
      else
        return resolve(teacher);
    });
  });
};

//------------------------PUT------------------------------


app.put('/:id', function (req, res) {

  let courses = req.body;
  courses.id = parseInt(req.params.id);
  if(course.name && course.teacher && course.city){
  let ide = parseInt(req.params.id);
  if(courses =="{}"){
    res.status(400).send("Solicitação não autorizada");
  }else{
    (async function() {
      for (let i = 0; i < courses.teacher.length; i++) {
        let teachers = await _getOneTeacher(courses.teacher[i]);
        courses.teacher[i] = teachers;
      }
      db.collection('course').update({"id": ide}, { $set: courses }, (err, result) => {
        if (err) {
          console.error("Erro ao Criar Um Novo Curso", err);
          res.status(500).send("Erro ao Criar Um Novo Curso");
        } else {
          res.status(201).send("Curso modificado com Sucesso.");
        }
      });
    })();
  }
}else res.status(403).send("Os dados devem ser preenchidos");
});




//-------------------------------DELETE--------------------------------
app.delete('/', function (req, res) {
  db.collection('course').remove( {}, function(err, info){
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

  db.collection('course').remove( {"id": id}, true, function(err, info){
    if(err){
      console.error("Ocorreu um erro ao deletar os curso da coleção");
      res.status(500);
    }else{
      let n_removed = info.result.n;
      if(n_removed > 0){
        res.status(204)
        res.send("Todos os curso foram removidos com sucesso");
        console.log("INF: Todos os curso" + n_removed + "foram removidos");
      }else{
        console.log("Nenhum curso foi removido");
        res.status(404).send("Nenhum professores foi removido");
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