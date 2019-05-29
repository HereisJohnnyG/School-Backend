//  --------------------user------------------------------
const express = require('express');
const app = express.Router();
const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://Jeffereson:31524@cluster0-5rgko.mongodb.net/test?retryWrites=true";
var db;

mongoClient.connect(mdbURL, {native_parser:true}, (err, database) => {
  if(err){
    console.error("Ocorreu um erro ao conectar ao MongoDB");
    send.status(500); //Internal server error
  }
  else{
    db = database.db('trainee-prominas');
  }
});


var id = 0;

var user = [{"name": "Marcos", "lastname":"Gomes", "profile": "user", "id": ++id},
            {"name": "Antonio", "lastname":"Nunes", "profile": "user", "id": ++id},
            {"name": "John", "lastname":"Doe", "profile": "admin", "id": ++id}
]

//-------------------------------GET--------------------------------
app.get('/', function (req, res) {
  db.collection('user').find({}).toArray( (err, users) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection User");
      send.status(500);
    }else res.send(users);
    
  });
});

app.get('/:id', function (req, res) {
  let id = parseInt(req.params.id);
  db.collection('user').find({"id": id}).toArray( (err, users) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection User");
      send.status(500);
    }else{
      if(user == []){
        res.status(404).send("Usuário não encontrado");
      }else res.send(users);
    } 
    
  });
});
//-------------------------------POST--------------------------------

app.post('/', function (req, res) {
  let usuario = req.body;
  
  //if(usuario.length > 0){
    console.log(usuario);
    usuario['id'] = ++id;
    //user.push(usuario);
    db.collection('user').insert(usuario);
    res.status(201).send("Usuário cadastrado com sucesso");
  //}else res.status(404).send("Não foi possível cadastrar o usuário")
})
//-------------------------------DELETE--------------------------------
app.delete('/', function (req, res) {
  db.collection('user').remove( {}, function(err, info){
    if(err){
      console.error("Ocorreu um erro ao deletar os usuários da coleção");
      res.status(500);
    }else{
      let n_removed = info.result.n;
      if(n_removed > 0){
        console.log("INF: Todos os usuários" + n_removed + "foram removidos");
        res.status(204).send("Todos os usuários foram removidos com sucesso");
      }else{
        console.log("Nenhum usuário foi removido");
        res.status(404).send("Nenhum usuário foi removido");
      } 
    } 
  });
});

app.delete('/:id', function (req, res) {
  let id = parseInt(req.params.id);

  db.collection('user').remove( {"id": id}, true, function(err, info){
    if(err){
      console.error("Ocorreu um erro ao deletar os usuários da coleção");
      res.status(500);
    }else{
      let n_removed = info.result.n;
      if(n_removed > 0){
        res.status(204)
        res.send("Todos os usuários foram removidos com sucesso");
        console.log("INF: Todos os usuários" + n_removed + "foram removidos");
      }else{
        console.log("Nenhum usuário foi removido");
        res.status(404).send("Nenhum usuário foi removido");
      } 
    } 
  });
})

//--------------------PUT-------------------------------

app.put('/:id', function (req, res) {

  let usuarios = req.body;
  if(usuarios =={}){
    res.status(400).send("Solicitação não autorizada");
  }else{
    //console.log(usuario.id);
    console.log(user.length);
    let id = parseInt(req.params.id);
    db.collection('user').update({"id": id}, usuarios);
    res.send("Usuário modificado com sucesso");
  }


});







//------------------------EXPORT------------------------------


module.exports = app;