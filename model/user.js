const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";
const database = require('../schema')

var db, id;

mongoClient.connect(mdbURL, {useNewUrlParser: true}, (err, database) => {
  if(err){
    console.error("Ocorreu um erro ao conectar ao MongoDB");
    send.status(500); //Internal server error
  }
  else{
    db = database.db('trainee-prominas');
    db.collection('user').find({}).toArray((err, user) =>{id = user.length});
  }
});

exports.getAll = (req, res) => {
    let where = {status:1};
    let collun = {projection: {_id: 0, id: 1, name: 1, lastname:1, profile:1}};
    get(where,collun)
        .then(users => {
          if(users.length > 0){
            res.send(users);
          }else{
            res.status(204);
          }
        }).catch(err => {
            console.log(err);
            console.error("Ocorreu um erro ao conectar a collection User");
            res.status(500).send('Ocorreu um erro');
    });
}


exports.getOne = (req, res) => {
  let id = parseInt(req.params.id);
  let where = {"id": id, status:1};
  let collun = {projection: {_id: 0, id: 1, name: 1, lastname:1, profile:1}};
  get(where,collun)
      .then(users => {
        if(users.length > 0){
          res.send(users);
        }else{
          res.status(204);
        }
      }).catch(err => {
          console.log(err);
          console.error("Ocorreu um erro ao conectar a collection User");
          res.status(500).send('Ocorreu um erro');
  });
}


exports.post = (req, res) => {
  let usuario = {};
  usuario.name = req.body.name;
  usuario.lastname = req.body.lastname;
  usuario.profile = req.body.profile;

  if(usuario.name && usuario.lastname && (usuario.profile.toUpperCase() == "ADMIN" || usuario.profile.toUpperCase() == "GUESS") ){
      usuario.id = getId();
      usuario.status = 1;
      insert(usuario).then(
          user => {
              res.status(201).send("Usuário cadastrado com sucesso");
      }).catch(err => {
          console.log(err);
          console.error("Ocorreu um erro ao conectar a collection User");
          res.status(500).send('Ocorreu um erro');
      });
  }else res.status(401).send("Campo invalido");
}

exports.edit = (req, res) => {
  let usuarios = {};
    usuarios.name = req.body.name;
    usuarios.lastname = req.body.lastname;
    usuarios.profile = req.body.profile;
    if(req.body.name && req.body.lastname && (req.body.profile.toUpperCase() == "ADMIN" || req.body.profile.toUpperCase() == "GUESS")){
      let id = parseInt(req.params.id);
      usuarios.id = id;
      troca(id, usuarios).then(results => { 
        if(results == null) {
          res.status(401).send("Não foi possivel completar a atualização")
        }else 
          //console.log(results.matchedCount);
          if(results.matchedCount > 0){
            res.send("Usuário modificado com sucesso");
          }else res.send("Usuário não encontrado");
      }).catch(err => {
        res.status(401).send("Erro na atualização");
      });
    }else res.status(401).send("Campo invalido");
}

exports.delete = (req, res) => {
  let id = parseInt(req.params.id);
  //------------Alternate status to 1 for "delete" ---------------------//
    deleta(id).then( results => {
        if(results.value == null) {
            res.status(204).send("Não foi possivel encontrar o usuário")
        }
        else res.send("Usuário excluido com sucesso");
    }).catch(err => {
        console.error("Ocorreu um erro ao deletar os usuários da coleção");
        res.status(500);
    })
}

getId = () => {return ++id}

get = (where, collun) =>  {
    return database.user.find(where, collun).exec();
}

insert = (document) => {
    return db.collection('user').insertOne(document);
}

troca = (id, document) => {
    return db.collection('user').updateOne({"id": id, "status": 1}, {$set: document});
}
deleta = (id) => {
    return db.collection('user').findOneAndUpdate({"id": id, "status": 1}, {$set: {status: 0}});
}

