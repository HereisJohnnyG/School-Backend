const modelCourse = require("../model/course");
const modelStudent = require("../model/student");
const modelTeacher = require("../model/teacher");
const Joi = require("joi");

const mongoose = require("mongoose");
const Schema = require("../schema").courseSchema;
const Course = mongoose.model('course', Schema);


//----------------------USER Validation-----------//
const schema = Joi.object().keys({
    name: Joi.string().required()
    .error(errors => {
        return {
          message: "O campo nome está incorreto ou não foi informado",
        };
    }),
    city: Joi.string().required()
    .error(errors => {
        return {
          message: "O campo cidade está incorreto ou não foi informado",
        };
    }),
    period: Joi.number()
    .error(errors => {
        return {
          message: "O campo period está incorreto ou não foi informado",
        };
    }),
    teacher: Joi.array().required()
    .error(errors => {
        return {
          message: "O campo teacher está incorreto ou não foi informado",
        };
    }),
});
//-----------------------------------------------//

/***********************GET**************************/
exports.getAll = (req, res) => {
    let courses;
    let where = {"status": 1};
    let collun = {'_id': 0, 'status':0, 'teacher.status': 0, 'teacher._id': 0};
    modelCourse.get(where,collun).then(
        courses => {
            if(courses.length > 0){
                res.json(courses);
              }else res.status(204).json("Nenhum valor a ser exibido");
        } 
    ).catch(err => {
        console.log(err);
        console.error("Ocorreu um erro ao procurar o curso");
        res.status(500).json("Ocorreu um erro ao procurar o curso");
    });
};


exports.getOne = (req, res) => {
    let courses;
    let id = parseInt(req.params.id);
    let where = {"id": id, "status": 1};
    let collun = {'_id': 0, 'status':0, 'teacher.status': 0, 'teacher._id': 0};
    modelCourse.get(where,collun).then(
        courses => {
            if(courses.length > 0){
                res.json(courses);
            }else res.status(204).json("Nenhum valor a ser exibido");
        } 
    ).catch(err => {
        console.log(err);
        console.error("Ocorreu um erro ao procurar o curso");
        res.status(500).json("Ocorreu um erro ao procurar o curso");
    });
}


/***********************POST**************************/

exports.post = (req, res) => {
    course = {};
    course.status = 1;
    course.name = req.body.name;
    course.city = req.body.city
    course.period = parseInt(req.body.period) || 8;
    course.id = modelCourse.getId();
    let curso_var = req.body.teacher;
    //-------------Joi Validation--------------------//
    schema.validate(req.body, {abortEarly: false}).then(validated => {
    //----------------------------------------------//
    course.teacher = [];
    (async function() {
        //--------------------store teacher's object into course ------------//
        for (let i = 0; i < curso_var.length; i++) {
            int = curso_var[i];
            let teachers = await modelTeacher.get_without_array({id: int, status: 1});
            if(teachers){
                course.teacher.push(teachers);
            }
        }
        //-------------------Mongoose Validation and database storage----------------------//
        let valid = new Course(course);
        valid.validate(error => {
            if(!error){
                modelCourse.insertCourse(course).then(result => {
                    if(course.teacher.length < curso_var.length){
                    res.status(201).json("Curso cadastrado mas informação de um id de professor digitado não exite")
                    }else res.status(201).json("Curso Cadastrado com Sucesso.");
                });
            }else{
                modelCourse.setId();
                res.status(401).json(error.errors.teacher.message);
            }
        })
        //------------------Catch Errors ---------------------------//
      })().catch(e => {
        modelCourse.setId();
        console.error("Erro ao Criar Um Novo Curso", e);
        res.status(500).json("Erro ao Criar Um Novo Curso");
    })
    //-------------------JOI Validation ------------//
    }).catch(validationError=>{
        modelCourse.setId();
        res.status(401).json(validationError.message);
    });
}

/***********************PUT**************************/
exports.edit = (req, res) => {
    courses = {};
    courses.name = req.body.name;
    courses.teacher = [];
    courses.city = req.body.city;
    let teacher_var = []; // Puts  the course on a temporary variable in case student can have more courses
    teacher_var = req.body.teacher;
    courses.period = parseInt(req.body.period) || 8;
    courses.id = parseInt(req.params.id);
    courses.status = 1;
    let ide = parseInt(req.params.id);
    //-------------Joi Validation--------------------//
    schema.validate(req.body, {abortEarly: false}).then(validated => {
    //----------------------------------------------//
    (async function() {
        for (let i = 0; i < teacher_var.length; i++) {
            int = teacher_var[i];
            let teachers = await modelTeacher.get_without_array({id: int, status: 1});
            if(teachers != null){
                courses.teacher.push(teachers);
            }
        }
        let valid = new Course(courses);
        valid.validate(error => {
        if(!error){
            where = {"id": ide};
            modelCourse.updateCourse(where, courses).then(result => {
            if(result.n == 0){
                res.status(404).json("Não foi encontrado curso para ser atualizado");
            }else{
                res.status(200).json("Curso modificado com sucesso");
                modelStudent.updateMany({ "course.id": ide }, { $set: { "course": courses }}).then(
                results => {
                    //console.log(course.teacher);   
                })
            }
            })
        }else res.status(401).json(error.errors.teacher.message);
    })
    })().catch(err => {
        console.log(courses.teacher.length);
        console.error("Erro ao modificar o curso", err);
        res.status(401).json("Erro ao modificar o Curso");
    });//-------------------JOI Validation ------------//
    }).catch(validationError=>{
        res.status(401).json(validationError.message);
    });
}

//----------------DELETE--------------------------------//

exports.delete = async (req, res) => {
    let id = parseInt(req.params.id);
    console.log(1);
    let session = await mongoose.startSession();
    session.startTransaction();
    console.log(2);
    try{
        console.log(3); 
        info = await modelCourse.deleta(id).session(session)

        if(info){  
            console.log(4); 
            await modelStudent.updateMany({ "course.id": id }, { $set: { "status": 0 }}).session(session);
            console.log(5);
            //throw new err;
            await session.commitTransaction();
            session.endSession();
            res.json("Curso excluido com sucesso"); 
               
        }else{
            console.log(6); 
            throw new err;
        }
    }catch(err) {
        //console.log(session); 
        await session.abortTransaction();
        console.log(8);
        session.endSession();
        console.log(9);
        console.error("Ocorreu um erro ao deletar o curso da coleção");
        res.status(500).json("Ocorreu um erro inesperado ao excluir o curso");
    };
}