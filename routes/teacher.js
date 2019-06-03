const express = require('express');
const app = express.Router();
const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";
var id;


mongoClient.connect(mdbURL, {useNewUrlParser: true}, (err, database) => {
  if(err){
    console.error("Ocorreu um erro ao conectar ao MongoDB");
    send.status(500); //Internal server error
  }
  else{
    db = database.db('trainee-prominas');
    db.collection('teacher').find({}).toArray((err, teacher) =>{id = teacher.length});
  }
});


//-------------------------------GET--------------------------------

app.get('/', function (req, res) {
  db.collection('teacher').find({'status':1}, {projection: {_id: 0, status: 0}}).toArray( (err, teachers) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection teacher");
      send.status(500);
    }else res.send(teachers);
    
  });
});


app.get('/:id', function (req, res) {
  let id = parseInt(req.params.id);
  db.collection('teacher').find({"id": id, status: 1}, {projection: {_id: 0, status: 0}}).toArray( (err, teachers) => {
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
  let usuario = {};
  usuario.name = req.body.name;
  usuario.lastname = req.body.lastname;
  if(usuario.name && usuario.lastname){
    usuario['id'] = ++id;
    if(typeof(req.body.phd) == 'boolean'){
      usuarios.phd = req.body.phd;
    }
    usuario.status = 1;
    db.collection('teacher').insertOne(usuario);
    res.status(201).send("Usuário cadastrado com sucesso");
  }else {
    res.status(403).send("Campo invalido");
  }
});

//------------------------PUT------------------------------

app.put('/:id', function (req, res) {
  if(req.body.name && req.body.lastname){ //Business rule (name and lastname must have a value
  let usuarios = [];
  //Fill teachers data
  usuarios.name = req.body.name;
  usuarios.lastname = req.body.lastname
  
  //verify if PHD is boolean
  if(typeof(req.body.phd) == 'boolean'){
    console.log('1',req.body.phd);
    usuarios.phd = req.body.phd;
  }

  let id = parseInt(req.params.id);
  usuarios.id = id;
  usuarios.status = 1;

  console.log('2', usuarios);
  db.collection('teacher').findOneAndReplace(
    {"id": id, "status": 1},
    {...usuarios},
    function (err, results){ 
      if(results == null) {
        res.status(403).send("Não foi possivel completar a atualização")
      }else{
        console.log('chegou aki');
        db.collection('course').updateOne(
          { "teacher.id": usuarios.id }, 
          { "$set": { "teacher.$": usuarios } }), 
          function(err_course, results){          
            if(!err_course)
              res.send("Usuário modificado com sucesso");
            else
              res.send('Erro na modificação')
        }
      }
    });
    }
});



//------------------------DELETE------------------------------
app.delete('/', function (req, res) {
  // res.status(204).send("Função desativada");
  db.collection('teacher').remove( {}, function(err, info){
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
  //------------Alternate status to 1 for "delete" ---------------------//

  db.collection('teacher').findOneAndUpdate({"id": id, "status": 1}, {$set: {status: 0}}, function (err, results){ 
      if(err){
        console.error("Ocorreu um erro ao deletar os usuários da coleção");
        res.status(500);
      }else if(results.value == null) {
        res.status(204).send("Não foi possivel encontrar o usuário")
      }else{
        // db.collection('course').findOneAndUpdate({}, 
        // {$pull: {teacher: {"id": id}}},
        // function(err, res){
        //   if(err){
        //     res.status(404).send("Nenhum professores foi removido");
        //   }
        //   else{
        //     res.send("Usuário excluido com sucesso");
        //   }
        // });
        res.send("Usuário excluido com sucesso");
      }
    
    });
});
  /*db.collection('teacher').remove( {"id": id}, true, function(err, info){
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
  })*/


//------------------------Functions------------------------------
//Function deprecated

/*function search_ID(ide) {
    let result = teacher.filter ( (s) => {return (s.id == ide)} );
    return(result);
}*/


//------------------------EXPORT------------------------------
/* module.exports = {app, search_ID}; */

module.exports = {app}