//  --------------------user------------------------------
const express = require('express');
const app = express.Router();

var id = 0;

var user = [{"id": ++id, "name": "Marcos", "lastname":"Gomes", "profile": "user"},
            {"id": ++id, "name": "Antonio", "lastname":"Nunes", "profile": "user"},
            {"id": ++id, "name": "John", "lastname":"Doe", "profile": "admin"}
]


app.get('/', function (req, res) {
  res.send(user);
})

app.post('/', function (req, res) {
  var student = req.body;
  user.push(student);
  res.send("usuário cadastrado com sucesso");
})

app.delete('/', function (req, res) {
  user = [];
  res.send("Todos os usuários foram removidos com sucesso");
})

app.get('/:name', function (req, res) {
  let name = req.params.name;
  let filteredstudent = user.filter ( (s) => {return (s.nome == name)} );
  if(filteredstudent.length >= 1){
    res.send(filteredstudent[0]);
  }else{
    res.status(404);
    res.send("Usuário não encontrado");
  }
  res.send(name);
})


app.post('/', function (req, res) {
  res.sendStatus(429);
})

module.exports = app;