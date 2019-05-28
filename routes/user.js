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
    res.send("Usuário deletado do sistema");
  }else{
    user = filteredstudent;
    res.status(404);
    res.send("Usuário não encontrado");
  }
})

//--------------------PUT-------------------------------

app.put('/', function (req, res) {
  let usuario = req.body;
  //console.log(usuario.id);
  console.log(user.length);
  for(let i = 0; i < user.length; i ++){
    console.log(user[i].id);
    if(user[i].id == usuario.id){
      user[i].name = usuario.name || user[i].name;
      user[i].lastname = usuario.lastname || user[i].lastname;
      user[i].profile = usuario.profile || user[i].profile;
      
    }  
  }
  res.send("Usuário modificado com sucesso");
})




//------------------------EXPORT------------------------------


module.exports = app;