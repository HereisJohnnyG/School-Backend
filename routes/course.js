const express = require('express');
const app = express.Router();
const app2 = require('./teacher.js');

var id = 0;
var course = [{"id": ++id, "name": "Engenharia", "period": "5", "teacher": 2, "city": "Timoteo"},
{"id": ++id, "name": "Agronomia", "period": "1", "teacher": 3, "city": "Ipatinga"},
{"id": ++id, "name": "Farmacia", "period": "7", "teacher": 1, "city": "Coronel Fabriciano"},
]



app.get('/', function (req, res) {
  res.send(course);
})

app.post('/', function (req, res) {
  let curso = req.body;
  course['id'] = ++id;
  
  course['teacher'] = app2.search_ID(1);
  console.log(course);
  course.push(curso);
  res.send("Curso cadastrado com sucesso");
})

app.delete('/', function (req, res) {
  course = [];
  res.send("Todos os Curso foram removidos com sucesso");
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

app.post('/', function (req, res) {
  res.sendStatus(429);
})


module.exports = app;