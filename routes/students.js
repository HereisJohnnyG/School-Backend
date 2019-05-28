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
  student['id'] = ++id;
  students.push(student);
  res.send("Estudante cadastrado com sucesso");
})

app.delete('/', function (req, res) {
  students = [];
  res.send("Todos os estudante foram removidos com sucesso");
})

app.delete('/:name', function (req, res) {
  let name = req.params.name;
  let filteredstudent = students.filter ( (s) => {return (s.name != name)} );
  if(students.length >= 1 && students.length != filteredstudent.length){
    students = filteredstudent;
    res.send(students);
  }else{
    students = filteredstudent;
    res.status(404);
    res.send("Estudante não encontrado");
  }
})

app.get('/:name', function (req, res) {
  let name = req.params.name;
  let filteredstudent = students.filter ( (s) => {return (s.name == name)} );
  if(filteredstudent.length >= 1){
    res.send(filteredstudent[0]);
  }else{
    res.status(404);
    res.send("Estudante não encontrado");
  }
})


app.post('/', function (req, res) {
  res.sendStatus(429);
})


module.exports = app;