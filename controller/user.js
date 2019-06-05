const modelUser = require("../model/user");

exports.getAll = (req, res) => {
    let where = {status:1};
    let collun = {projection: {_id: 0, id: 1, name: 1, lastname:1, profile:1}};
    modelUser.get(where,collun)
        .then(users => {
        res.send(users);
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
    modelUser.get(where,collun)
        .then(users => {
        res.send(users);
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
  
    if(usuario.name && usuario.lastname && usuario.profile){
        usuario['id'] = modelUser.getId();
        usuario.status = 1;
        modelUser.insert(usuario).then(
            user => {
                res.status(201).send("Usuário cadastrado com sucesso");
        }).catch(err => {
            console.log(err);
            console.error("Ocorreu um erro ao conectar a collection User");
            res.status(500).send('Ocorreu um erro');
        });
    }else res.status(403).send("Campo invalido");
}


exports.edit = (req, res) => {
  
    let usuarios = {};
    usuarios.name = req.body.name;
    usuarios.lastname = req.body.lastname;
    usuarios.profile = req.body.profile;
    if(req.body.name && req.body.lastname && req.body.profile){
      let id = parseInt(req.params.id);
      usuarios.id = id;
      modelUser.troca(id, usuarios).then(results => { 
        if(results == null) {
          res.status(401).send("Não foi possivel completar a atualização")
        }else 
          console.log(results.matchedCount);
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
    modelUser.deleta(id).then( results => {
        if(results.value == null) {
            res.status(204).send("Não foi possivel encontrar o usuário")
        }
        else res.send("Usuário excluido com sucesso");
    }).catch(err => {
        console.error("Ocorreu um erro ao deletar os usuários da coleção");
        res.status(500);
    })
}