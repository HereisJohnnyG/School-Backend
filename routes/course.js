const express = require('express');
const app = express.Router();
const app2 = require('./teacher.js');

var id = 0;
var course = [{"id": ++id, "name": "Engenharia", "period": "5", "teacher": 2, "city": "Timoteo"},
{"id": ++id, "name": "Agronomia", "period": "1", "teacher": 3, "city": "Ipatinga"},
{"id": ++id, "name": "Farmacia", "period": "7", "teacher": 1, "city": "Coronel Fabriciano"},
]


//-------------------------------GET--------------------------------

app.get('/', function (req, res) {
  res.send(course);
})

app.get('/:name', function (req, res) {
  let name = req.params.name;
  let filteredstudent = course.filter ( (s) => {return (s.nome == name)} );
  if(filteredstudent.length >= 1){
    res.send(filteredstudent[0]);
  }else{
    res.status(404);
    res.send("Curso não encontrado");
  }
})

//-------------------------------POST--------------------------------

app.post('/', function (req, res) {
  let curso = req.body;
  curso['id'] = ++id;
  
  if(curso.teacher){
      console.log(curso.teacher.length);
      let filteredteachers = curso.teacher.filter(element => { return app2.search_ID(element)!= ""});
      curso.teacher = filteredteachers;
      console.log(curso.teacher);
    for(let i = 0; i < curso.teacher.length; i++){
        curso.teacher[i] = app2.search_ID(curso.teacher[i]);
    }
  }
  course.push(curso);
  res.send("Curso cadastrado com sucesso");
})
//-------------------------------DELETE--------------------------------
app.delete('/', function (req, res) {
  course = [];
  res.send("Todos os Curso foram removidos com sucesso");
})

app.delete('/:id', function (req, res) {
  let id = req.params.id;
  let filteredcourses = course.filter ( (s) => {return (s.id != id)} );
  if(course.length >= 1 && course.length != filteredcourses.length){
    course = filteredcourses;
    res.send(course);
  }else{
    course = filteredcourses;
    res.status(404);
    res.send("Usuário não encontrado");
  }
})


//------------------------EXPORT------------------------------

module.exports = app;