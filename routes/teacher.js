const express = require('express');
const app = express.Router();

var user = [{"id": ++id, "name": "Marcos", "lastname":"Gomes", "phd": true},
            {"id": ++id, "name": "Antonio", "lastname":"Nunes", "phd": false},
            {"id": ++id, "name": "John", "lastname":"Doe", "phd": true}
]

app.get('/', function (req, res) {
  res.send(teacher);
})

app.post('/', function (req, res) {
  var student = req.body;
  teacher.push(student);
  res.send("Professor cadastrado com sucesso");
})

app.delete('/', function (req, res) {
  teacher = [];
  res.send("Todos os Professor foram removidos com sucesso");
})

app.get('/:name', function (req, res) {
  let name = req.params.name;
  let filteredstudent = teacher.filter ( (s) => {return (s.nome == name)} );
  if(filteredstudent.length >= 1){
    res.send(filteredstudent[0]);
  }else{
    res.status(404);
    res.send("Professor não encontrado");
  }
  res.send(name);
})


app.post('/', function (req, res) {
  res.sendStatus(429);
})


module.exports = app;