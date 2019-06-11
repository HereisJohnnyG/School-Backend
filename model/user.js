const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";
const mongoose = require("mongoose");
const Schema = require("../schema").userSchema;
const User = mongoose.model('user', Schema);
const Joi = require('joi');
var db, id;


//----------------------USER Validation-----------//
const schema = Joi.object().keys({
  name: Joi.string().required()
  .error(errors => {
    return {
      message: "O campo nome está incorreto ou não foi informado",
    };
  }),
  lastname: Joi.string().required()
  .error(errors => {
    return {
      message: "O campo sobrenome está incorreto ou não foi informado",
    };
  }),
  profile: Joi.string().required()
  .error(errors => {
    return {
      message: "O campo Profile está incorreto ou não foi informado",
    };
  }),
});
//-----------------------------------------------//



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



exports.insert_data = (req, res) => {
    let where = {status:1};
    let collun = {projection: {_id: 0, id: 1, name: 1, lastname:1, profile:1}};
    get(where,collun)
        .then(users => {
          if(users.length > 0){
            res.send(users);
          }else res.status(204).send("Nenhum valor a ser exibido");
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
          }else res.status(204).send("Nenhum valor a ser exibido");
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
  usuario.id = getId();
  usuario.status = 1;
  let valid = new User(usuario);

//-------------Joi Validation--------------------//
  schema.validate(req.body, {abortEarly: false}).then(validated => {
//-------------Mongoose Validation--------------//
  valid.validate(error => {
//--------------Code----------------------------//
    if(!error){
      insert(usuario).then(user => {
        res.status(201).send("Usuário cadastrado com sucesso");
      }).catch(err => {
          console.log(err);
          console.error("Ocorreu um erro ao conectar a collection User");
          res.status(500).send('Ocorreu um erro');
      });
    }
    else res.status(401).send(error.errors.profile.message);
  })
  //-------------------JOI Validation ------------//
  }).catch(validationError=>{
		res.status(401).send(validationError.message);
	});
}

exports.edit = (req, res) => {
  let usuario = {};
  let id = parseInt(req.params.id);
  usuario.id = id;
  usuario.name = req.body.name;
  usuario.lastname = req.body.lastname;
  usuario.profile = req.body.profile;
  let valid = new User(usuario);
  //-------------Joi Validation--------------------//
  schema.validate(req.body, {abortEarly: false}).then(validated => {
  //-------------Mongoose Validation--------------//
  valid.validate(error => {
    if(!error){
      troca(id, usuario).then(results => { 
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
      }else res.status(401).send(error.errors.profile.message);
    })
    //-------------------JOI Validation ------------//
  }).catch(validationError=>{
		res.status(401).send(validationError.message);
	});
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
    return db.collection('user').find(where, collun).toArray();
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

