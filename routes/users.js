//  --------------------user------------------------------
const express = require('express');
const app = express.Router();

var id = 0;

var user = [{"id": ++id, "name": "Marcos", "lastname":"Gomes", "profile": "user"},
            {"id": ++id, "name": "Antonio", "lastname":"Nunes", "profile": "user"},
            {"id": ++id, "name": "John", "lastname":"Doe", "profile": "admin"}
]

//-------------------------------GET--------------------------------
app.get('/', function (req, res) {
  res.send(user);
})

app.get('/:id', function (req, res) {
  let id = req.params.id;
  let filtereduser = user.filter ( (s) => {return (s.id == id)} );
  if(filtereduser.length >= 1){
    res.send(filtereduser[0]);
  }else{
    res.status(404);
    res.send("Usuário não encontrado");
  }
})
//-------------------------------POST--------------------------------
app.post('/', function (req, res) {
  res.sendStatus(429);
})

app.post('/', function (req, res) {
  var usuario = req.body;
  usuario['id'] = ++id;
  user.push(usuario);
  res.send("Usuário cadastrado com sucesso");
})
//-------------------------------DELETE--------------------------------
app.delete('/', function (req, res) {
  user = [];
  res.send("Todos os usuários foram removidos com sucesso");
})

app.delete('/:id', function (req, res) {
  let id = req.params.id;
  let filteredstudent = user.filter ( (s) => {return (s.id != id)} );
  if(user.length >= 1 && user.length != filteredstudent.length){
    user = filteredstudent;
    res.send(user);
  }else{
    user = filteredstudent;
    res.status(404);
    res.send("Usuário não encontrado");
  }
})






module.exports = app;