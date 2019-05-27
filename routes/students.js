const express = require('express');
const app = express.Router();

var id = 0;

var students = [{"id": ++id, "name": "Marcos", "lastname": "Gomes", "age": "23", "course": "Engenharia"},
{"id": ++id, "name": "Jose", "lastname": "Gomes", "age": "23", "course": "Engenharia"},
{"id": ++id, "name": "Gustavo", "lastname": "Gomes", "age": "23", "course": "Engenharia"},
]

app.get('/', function (req, res) {
  res.send(students);
})

app.post('/', function (req, res) {
  var student = req.body;
  students.push(student);
  res.send("Estudante cadastrado com sucesso");
})

app.delete('/', function (req, res) {
  students = [];
  res.send("Todos os estudante foram removidos com sucesso");
})

app.delete('/:name', function (req, res) {
  let name = req.params.name;
  let filteredstudent = students.delete( name );
  res.send("Todos os estudante foram removidos com sucesso");
})

app.get('/:name', function (req, res) {
  let name = req.params.name;
  let filteredstudent = students.filter ( (s) => {return (s.nome == name)} );
  if(filteredstudent.length >= 1){
    res.send(filteredstudent[0]);
  }else{
    res.status(404);
    res.send("Estudante não encontrado");
  }
  res.send(name);
})


app.post('/', function (req, res) {
  res.sendStatus(429);
})


module.exports = app;