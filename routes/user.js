//  --------------------user------------------------------
const express = require('express');
const app = express.Router();
const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";
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


//-------------------------------GET--------------------------------
app.get('/', function (req, res) {
  db.collection('user').find({}, {projection: {_id: 0, id: 1, name: 1, lastname:1, profile:1}}).toArray( (err, users) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection User");
      send.status(500);
    }else res.send(users);
    
  });
});

app.get('/:id', function (req, res) {
  let id = parseInt(req.params.id);
  db.collection('user').find({"id": id}, {projection: {_id: 0, id: 1, name: 1, lastname:1, profile:1}}).toArray( (err, users) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection User");
      send.status(500);
    }else{
      if(users == []){
        res.status(404).send("Usuário não encontrado");
      }else res.send(users);
    } 
    
  });
});
//-------------------------------POST--------------------------------

app.post('/', function (req, res) {
  let usuario = req.body;
  if(usuario.name && usuario.lastname && usuario.profile){
    console.log(usuario);
    usuario['id'] = ++id;
    usuario.status = 1;
    db.collection('user').insert(usuario);
    res.status(201).send("Usuário cadastrado com sucesso");
  }else res.status(403).send("Campo invalido");
});
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
        res.status(200).send("Todos os usuários foram removidos com sucesso");
      }else{
        console.log("Nenhum usuário foi removido");
        res.status(204).send("Nenhum usuário foi removido");
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
        res.status(200)
        res.send("Todos os usuários foram removidos com sucesso");
        console.log("INF: Todos os usuários" + n_removed + "foram removidos");
      }else{
        console.log("Nenhum usuário foi removido");
        res.status(204).send("Nenhum usuário foi removido");
      } 
    } 
  });
})

//--------------------PUT-------------------------------

app.put('/:id', function (req, res) {
  
    let usuarios = req.body;
    if(usuarios.name && usuarios.lastname && usuarios.profile){
      let id = parseInt(req.params.id);
      usuarios.id = id;
      usuarios.status = 1;
      db.collection('user').findOneAndUpdate({"id": id, "status": 1}, usuarios, {new: true}, function (err, results){ 
        if(results == 0) {
          res.status(404).send("Nenhum campo atualizado")
        }else res.send("Usuário modificado com sucesso");
      });
    }else res.status(403).send("Campo invalido");
});







//------------------------EXPORT------------------------------


module.exports = app;