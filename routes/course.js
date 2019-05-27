const express = require('express');
const app = express.Router();

var id = 0;
var course = [{"id": ++id, "name": "Engenharia", "period": "5", "teacher": "José", "city": "Timoteo"},
{"id": ++id, "name": "Agronomia", "period": "1", "teacher": "João", "city": "Ipatinga"},
{"id": ++id, "name": "Farmacia", "period": "7", "teacher": "Julio", "city": "Coronel Fabriciano"},
]



app.get('/', function (req, res) {
  res.send(course);
})

app.post('/', function (req, res) {
  var student = req.body;
  course.push(student);
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
  res.send(name);
})


app.post('/', function (req, res) {
  res.sendStatus(429);
})


module.exports = app;