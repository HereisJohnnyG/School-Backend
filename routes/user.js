//  --------------------user------------------------------
const express = require('express');
const app = express.Router();

var id = 0;

var user = [{"name": "Marcos", "lastname":"Gomes", "profile": "user", "id": ++id},
            {"name": "Antonio", "lastname":"Nunes", "profile": "user", "id": ++id},
            {"name": "John", "lastname":"Doe", "profile": "admin", "id": ++id}
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
  let usuario = req.body;
  
  //if(usuario.length > 0){
    console.log(usuario);
    usuario['id'] = ++id;
    user.push(usuario);
    res.status(201).send("Usuário cadastrado com sucesso");
  //}else res.status(404).send("Não foi possível cadastrar o usuário")
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
    res.send("Usuário removido do sistema");
  }else{
    user = filteredstudent;
    res.status(404);
    res.send("Usuário não encontrado");
  }
})

//--------------------PUT-------------------------------

app.put('/:id', function (req, res) {
  let usuarios = req.body;
  //console.log(usuario.id);
  console.log(user.length);
  let id = parseInt(req.params.id);
  let filteredstudent = user.filter ( (s) => {return (s.id == id)} );
  let index = user.indexOf(filteredstudent[0]);
  //console.log(index, filteredstudent[0], usuarios);
  if(index >= 0){
      user[index].name = usuarios.name || user[index].name;
      user[index].lastname = usuarios.lastname || user[index].lastname;
      user[index].profile = usuarios.profile || user[index].profile;  
      res.send("Usuário modificado com sucesso");
  }else res.status(404).send("Usuário não encontrado");
});







//------------------------EXPORT------------------------------


module.exports = app;