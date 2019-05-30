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



id = 0;
var teacher = [];

//-------------------------------GET--------------------------------

app.get('/', function (req, res) {
  db.collection('teacher').find({}).toArray( (err, teachers) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection teacher");
      send.status(500);
    }else res.send(teachers);
    
  });
});


app.get('/:id', function (req, res) {
  let id = parseInt(req.params.id);
  db.collection('teacher').find({"id": id}).toArray( (err, teachers) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection Teacher");
      send.status(500);
    }else{
      if(teachers == []){
        res.status(404).send("Professor não encontrado");
      }else res.send(teachers);
    } 
    
  });
});
//------------------------POST------------------------------

app.post('/', function (req, res) {
  let usuario = req.body;
    usuario['id'] = ++id;
    db.collection('teacher').insert(usuario);
    res.status(201).send("Usuário cadastrado com sucesso");
});

//------------------------PUT------------------------------

app.put('/:id', function (req, res) {

  let usuarios = req.body;
  if(usuarios =={}){
    res.status(400).send("Solicitação não autorizada");
  }else{
    let id = parseInt(req.params.id);
    usuarios.id = id;
    db.collection('teacher').update({"id": id}, usuarios);
    res.send("Professor modificado com sucesso");
  }
});



//------------------------DELETE------------------------------
app.delete('/', function (req, res) {
  db.collection('teacher').remove( {}, function(err, info){
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

  db.collection('teacher').remove( {"id": id}, true, function(err, info){
    if(err){
      console.error("Ocorreu um erro ao deletar os professores da coleção");
      res.status(500);
    }else{
      let n_removed = info.result.n;
      if(n_removed > 0){
        res.status(204)
        res.send("Todos os professores foram removidos com sucesso");
        console.log("INF: Todos os professores" + n_removed + "foram removidos");
      }else{
        console.log("Nenhum professores foi removido");
        res.status(404).send("Nenhum professores foi removido");
      } 
    } 
  });
})


//------------------------Functions------------------------------

function search_ID(ide) {
    let result = teacher.filter ( (s) => {return (s.id == ide)} );
    return(result);
}


//------------------------EXPORT------------------------------
module.exports = {app, search_ID};
