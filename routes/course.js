const express = require('express');
const app = express.Router();
const app2 = require('./teacher.js');
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

course = [];
//-------------------------------GET--------------------------------

app.get('/', function (req, res) {
  db.collection('course').find({}).toArray( (err, courses) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection Course");
      send.status(500);
    }else res.send(courses);
    
  });
});


app.get('/:id', function (req, res) {
  let id = parseInt(req.params.id);
  db.collection('course').find({"id": id}).toArray( (err, courses) => {
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
  let ide = parseInt(req.params.id);
  if(courses =={}){
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
});


/*app.put('/:id', function (req, res) {
  let id = parseInt(req.params.id);
  let curso = req.body;
  let filteredcourses = course.filter ( (s) => {return (s.id == id)} );
  let index = course.indexOf(filteredcourses[0]);
  console.log(index, filteredcourses[0], curso);
  if(index >= 0){
    if(curso.teacher){
      course[index].teacher = [];
      for(let i = 0; i < curso.teacher.length; i++){
        console.log(app2.search_ID(curso.teacher[i]));
        course[index].teacher[i] = app2.search_ID(curso.teacher[i])[0];
      }
    }
    course[index].name = curso.name || course[index].name;
    course[index].period = curso.period || course[index].period;
    course[index].city = curso.phd || course[index].city;
    //course[index].teacher = curso.teacher || course[index].teacher;
    res.send("Curso modificado com sucesso");
  }else res.status(404).send("Curso modificado com sucesso");  
})*/




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