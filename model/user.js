const mongoose = require("mongoose");
const Schema = require("../schema").userSchema;
const User = mongoose.model('User', Schema, 'user');
const Joi = require('joi');

var id;
User.countDocuments({}, (err, count) => {
	id = count;
});

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
 

//-------------------GET----------------------------//

exports.getAll = (req, res) => {
    let where = {status:1};
    let collun = {_id: 0, id: 1, name: 1, lastname:1, profile:1};
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
    let collun = {_id: 0, id: 1, name: 1, lastname:1, profile:1};
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

//-------------------POST----------------------------//
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
          setId();
          console.log(err);
          console.error("Ocorreu um erro ao conectar a collection User");
          res.status(500).send('Ocorreu um erro');
      });
    }else{
      setId();
      res.status(401).send(error.errors.profile.message);
    }
  })
  //-------------------JOI Validation ------------//
  }).catch(validationError=>{
    setId();
		res.status(401).send(validationError.message);
	});
}


//-------------------PUT----------------------------//

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
          if(results.nModified == 1){
            res.send("Usuário modificado com sucesso");
          }else if (results.n == 1){
            res.send("Nenhum campo atualizado para o usuário");
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


/******************DELETE************************/

exports.delete = (req, res) => {
  let id = parseInt(req.params.id);
  //------------Alternate status to 1 for "delete" ---------------------//
    deleta(id).then( results => {
        if(results == null) {
            res.status(204).send("Não foi possivel encontrar o usuário")
        }
        else res.send("Usuário excluido com sucesso");
    }).catch(err => {
        console.error("Ocorreu um erro ao deletar os usuários da coleção");
        res.status(500);
    })
}



getId = () => {return ++id}

setId = () => {return --id}

get = (where, collun) =>  {
    return User.find(where, collun).sort({id: 1});
}

insert = (document) => {
    return User.create(document);
}

troca = (id, document) => {
    return User.updateOne({"id": id, "status": 1}, {$set: document});
}
deleta = (id) => {
    return User.findOneAndUpdate({"id": id, "status": 1}, {$set: {status: 0}});
}

