const modelTeacher = require("../model/teacher");
const modelCourse = require("../model/course");
const modelStudent = require("../model/student");

exports.getAll = (req, res) => {
    let where = {'status':1}
    let collun = {'_id': 0, 'status': 0, '__v': 0}
    modelTeacher.get(where,collun)
        .then(teachers => {
                res.send(teachers);
        }).catch(err => {
        console.error("Ocorreu um erro ao enviar os usuários", err);
        res.status(500).send('Ocorreu um erro');
    });
}

exports.getOne = (req, res) => {
    let id = parseInt(req.params.id);
    let where = {"id": id, status:1};
    let collun = {'_id': 0, 'status': 0, '__v': 0};
    modelTeacher.get(where,collun)
        .then(teachers => {
            res.send(teachers);
        }).catch(err => {
        console.error("Ocorreu um erro ao enviar os usuários", err);
        res.status(500).send('Ocorreu um erro');
    });
}

exports.post = (req, res) => {
    let usuario = {};
    usuario.name = req.body.name;
    usuario.lastname = req.body.lastname;
    if(usuario.name && usuario.lastname && (req.body.phd == true)){
        usuario.id = modelTeacher.getId();
        if(typeof(req.body.phd) == 'boolean'){
        usuario.phd = req.body.phd;
        }
        usuario.status = 1;
        modelTeacher.insert(usuario)
            .then(e => {
                res.status(201).send("Usuário cadastrado com sucesso");
            }).catch(e => {
                console.error("Erro ao cadastrar usuário", e);
                res.status(401).send("Erro ao cadastrar usuário");
            });
    }else res.status(401).send("Campo Invalido")
}

exports.edit = (req, res) => {
    if(req.body.name && req.body.lastname && (req.body.phd == true)){ //Business rule (name and lastname must have a value
    let usuarios = {};
    //Fill teachers data
    usuarios.name = req.body.name;
    usuarios.lastname = req.body.lastname;
    
    //verify if PHD is boolean
    if(typeof(req.body.phd) == 'boolean'){
      usuarios.phd = req.body.phd;
    }
  
    let id = parseInt(req.params.id);
    usuarios.id = id;
    usuarios.status = 1;


    where = {"id": id, "status": 1};
    
    modelTeacher.troca(where, usuarios)
        .then(
            results => {
                if(results.value == null) {
                    res.status(401).send("Não foi possivel completar a atualização")
                }
                else{ 
                    modelCourse.updateMany(
                        { "teacher.id": usuarios.id }, 
                        { $set: {"teacher.$": usuarios}}).then(results => {
                          if(results.n > 0){
                            modelCourse.get({"teacher.id": id, status: 1}, {}).then(course_temo => {
                              course_temo.forEach((e) => {
                                modelStudent.replace(
                                  {"status": 1, "course.id": e.id},
                                  {$set: {"course": e}})
                                })
                              })
                        
                             res.send("Professor modificado com sucesso");
                          }
                          else{
                            res.send('Erro na modificação');
                          }
                      })
                    }

            })
            .catch(e => res.status(401).send("Não foi possivel completar a atualização"));
    }else res.status(401).send("Campo Invalido")
} // error

exports.deleta = (req, res) => {
    let id = parseInt(req.params.id);
    where = {"id": id, "status": 1};
     modelTeacher.deleta(where).then(results => { 
         if (results.value == null) {
             res.status(204).send("Não foi possivel encontrar o usuário")
         }else{
            modelCourse.updateMany({}, {$pull: {"teacher": {"id": id}}}).then(result => {
            modelCourse.get({"status": 1}).then(course_temo => {
                course_temo.forEach((e) => {
                  modelStudent.replace(
                    {"status": 1, "course.id": e.id},
                    {$set: {"course": e}})
                  })
            })})
            res.send("O professor foi removido com sucesso")
         }
     })
     .catch(e => {
         console.error("Ocorreu um erro ao deletar os professores da coleção", e);
          res.status(500);
     })
}