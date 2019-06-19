const modelTeacher = require("../model/teacher");
const modelCourse = require("../model/course");
const modelStudent = require("../model/student");
const mongoose = require("mongoose");
const Schema = require("../schema").teacherSchema;
const Teacher = mongoose.model('teacher', Schema);
const Joi = require("joi");


//----------------------USER Validation-----------//
const schema = Joi.object().keys({
    name: Joi.string().required()
    .error(errors => {
        return {
          message: "O campo name está incorreto ou não foi informado",
        };
    }),
	lastname: Joi.string().required()
    .error(errors => {
        return {
          message: "O campo lastname está incorreto ou não foi informado",
        };
    }),
    phd: Joi.boolean().required()
    .error(errors => {
        return {
          message: "O campo phd está incorreto ou não foi informado",
        };
    }),
});
//-----------------------------------------------//

/*****************GET**************************/

exports.getAll = (req, res) => {
    let where = {'status':1}
    let collun = {_id: 0, status: 0}
    modelTeacher.get(where,collun)
        .then(teachers => {
            if(teachers.length > 0){
                res.json(teachers);
              }else res.status(204).json("Nenhum valor a ser exibido");
        }).catch(err => {
        console.error("Ocorreu um erro ao enviar os usuários", err);
        res.status(500).json('Ocorreu um erro');
    });
}

exports.getOne = (req, res) => {
    let id = parseInt(req.params.id);
    let where = {"id": id, status:1};
    let collun = {_id: 0, status: 0}
    modelTeacher.get(where,collun)
        .then(teachers => {
            if(teachers.length > 0){
                res.json(teachers);
            }else res.status(204).json("Nenhum valor a ser exibido");
        }).catch(err => {
        console.error("Ocorreu um erro ao enviar os usuários", err);
        res.status(500).json('Ocorreu um erro');
    });
}

/******************POST**************************/
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
                res.status(201).json("Usuário cadastrado com sucesso");
            }).catch(e => {
                modelTeacher.setId(); //DECREASE ID IN CASE OF ERROR
                res.status(401).json("Erro ao cadastrar usuário");
            });
        }else{
            modelTeacher.setId(); //DECREASE ID IN CASE OF ERROR
            res.status(401).json(error.errors.phd.message)
        }
    })
      //-------------------JOI Validation ------------//
    }).catch(validationError=>{
        modelTeacher.setId(); //DECREASE ID IN CASE OF ERROR
        res.status(401).json(validationError.message);
    });
}


/*******************PUT********************/

exports.edit = (req, res) => {
    let usuarios = {};
    usuarios.name = req.body.name;
    usuarios.lastname = req.body.lastname;
    usuarios.phd = req.body.phd;
    let id = parseInt(req.params.id);
    usuarios.id = id;
    usuarios.status = 1;

    let valid = new Teacher(usuarios);
    //-------------Joi Validation--------------------//
    schema.validate(req.body, {abortEarly: false}).then(validated => {
    //-------------Mongoose Validation--------------//
    valid.validate(error => {
        if(!error){
            where = {"id": id, "status": 1};
            modelTeacher.troca(where, usuarios).then(
            results => {
                if(results.n == 0) {
                    res.status(401).json("Não foi possivel completar a atualização")
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
                                {$set: {"course": e}}).then(result => {});
                                })
                              })
                              res.json("Professor modificado com sucesso");
                          }
                          else{
                            res.json('Erro na modificação');
                          }
                    })
                }
            }).catch(e => res.status(401).json("Não foi possivel completar a atualização"));
        }else res.status(401).json(error.errors.phd.message)
    })
      //-------------------JOI Validation ------------//
    }).catch(validationError=>{
        res.status(401).json(validationError.message);
    });
}

/***************DELETE***********************/

exports.deleta = async (req, res) => {
    let id = parseInt(req.params.id);
    where = {"id": id, "status": 1};
    let session = await mongoose.startSession();
    session.startTransaction();
    try{
        results = await modelTeacher.deleta(where).session(session);
    if (results == null) {
        throw "Não foi possivel encontrar o usuário";
    }else{
    await modelCourse.updateMany({}, {$pull: {"teacher": {"id": id}}}).session(session);
    modelCourse.get({"status": 1}).then( async course_temo => {
    await course_temo.forEach(async (e) => {
        await modelStudent.replace(
        {"status": 1, "course.id": e.id},
        {$set: {"course": e}});
    })
    });
    await session.commitTransaction();
    await session.endSession();
    res.json("O professor foi removido com sucesso")
    }
    }catch(e){
        await session.abortTransaction();
        await session.endSession();
        console.error("Ocorreu um erro ao deletar os professores da coleção:", e);
        res.status(500).json(e);
    }
}