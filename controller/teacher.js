const modelTeacher = require("../model/teacher");
const modelCourse = require("../model/course");
const modelStudent = require("../model/student");
const mongoose = require("mongoose");
const Schema = require("../schema").teacherSchema;
const Teacher = mongoose.model('teacher', Schema);
const Joi = require("joi");


//----------------------USER Validation-----------//
const schema = Joi.object().keys({
	name: Joi.string().required(),
	lastname: Joi.string().required(),
	phd: Joi.boolean().required(),
});
//-----------------------------------------------//



exports.getAll = (req, res) => {
    let where = {'status':1}
    let collun = {projection: {_id: 0, status: 0}}
    modelTeacher.get(where,collun)
        .then(teachers => {
            if(teachers.length > 0){
                res.send(teachers);
              }else res.status(204).send("Nenhum valor a ser exibido");
        }).catch(err => {
        console.error("Ocorreu um erro ao enviar os usuários", err);
        res.status(500).send('Ocorreu um erro');
    });
}

exports.getOne = (req, res) => {
    let id = parseInt(req.params.id);
    let where = {"id": id, status:1};
    let collun = {projection: {_id: 0, status: 0}}
    modelTeacher.get(where,collun)
        .then(teachers => {
            if(teachers.length > 0){
                res.send(teachers);
            }else res.status(204).send("Nenhum valor a ser exibido");
        }).catch(err => {
        console.error("Ocorreu um erro ao enviar os usuários", err);
        res.status(500).send('Ocorreu um erro');
    });
}

exports.post = (req, res) => {
    let usuario = {};
    usuario.name = req.body.name;
    usuario.lastname = req.body.lastname;
    usuario.id = modelTeacher.getId();
    usuario.phd = req.body.phd;
    usuario.status = 1;
    let valid = new Teacher(usuario);
    //-------------Joi Validation--------------------//
    schema.validate(req.body, {abortEarly: false}).then(validated => {
    //-------------Mongoose Validation--------------//
    valid.validate(error => { 
        if(!error){
            modelTeacher.insert(usuario).then(e => {
                res.status(201).send("Usuário cadastrado com sucesso");
            }).catch(e => {
                res.status(401).send("Erro ao cadastrar usuário");
            });
        }else res.status(401).send(error.errors.phd.message)
    })
      //-------------------JOI Validation ------------//
    }).catch(validationError=>{
        res.status(401).send('Campos obrigatórios não preenchidos ou preenchidos incorretamente.');
    });
}

exports.edit = (req, res) => {
    let usuarios = {};
    usuarios.name = req.body.name;
    usuarios.lastname = req.body.lastname;
    usuarios.phd = req.body.phd;
    let id = parseInt(req.params.id);
    usuarios.id = id;
    usuarios.status = 1;
    //console.log(usuarios)
    let valid = new Teacher(usuarios);
    //-------------Joi Validation--------------------//
    schema.validate(req.body, {abortEarly: false}).then(validated => {
    //-------------Mongoose Validation--------------//
    valid.validate(error => {
        if(!error){
            where = {"id": id, "status": 1};
            modelTeacher.troca(where, usuarios).then(
            results => {
                if(results.value == null) {
                    res.status(401).send("Não foi possivel completar a atualização")
                }
                else{ 
                    modelCourse.updateMany(
                    { "teacher.id": usuarios.id }, 
                    { $set: {"teacher.$": usuarios}}).then(results => {
                        if(results){
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
            }).catch(e => res.status(401).send("Não foi possivel completar a atualização"));
        }else res.status(401).send("Campo Invalido")
    })
      //-------------------JOI Validation ------------//
    }).catch(validationError=>{
        res.status(401).send('Campos obrigatórios não preenchidos ou preenchidos incorretamente.');
    });
}

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