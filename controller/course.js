const modelCourse = require("../model/course");
const modelStudent = require("../model/student");
const modelTeacher = require("../model/teacher");


const mongoose = require("mongoose");
const Schema = require("../schema").courseSchema;
const Course = mongoose.model('course', Schema);

exports.getAll = (req, res) => {
    let courses;
    let where = {"status": 1};
    let collun = {projection: {'_id': 0, 'status':0, 'teacher.status': 0, 'teacher._id': 0}};
    modelCourse.get(where,collun).then(
        courses => {
            if(courses.length > 0){
                res.send(courses);
              }else res.status(204).send("Nenhum valor a ser exibido");
        } 
    ).catch(err => {
        console.log(err);
        console.error("Ocorreu um erro ao procurar o curso");
        res.status(500).send("Ocorreu um erro ao procurar o curso");
    });
};


exports.getOne = (req, res) => {
    let courses;
    let id = parseInt(req.params.id);
    let where = {"id": id, "status": 1};
    let collun = {projection: {'_id': 0, 'status':0, 'teacher.status': 0, 'teacher._id': 0}};
    modelCourse.get(where,collun).then(
        courses => {
            if(courses.length > 0){
                res.send(courses);
            }else res.status(204).send("Nenhum valor a ser exibido");
        } 
    ).catch(err => {
        console.log(err);
        console.error("Ocorreu um erro ao procurar o curso");
        res.status(500).send("Ocorreu um erro ao procurar o curso");
    });
}

exports.post = (req, res) => {
    course = {};
    course.status = 1;
    course.name = req.body.name;
    course.city = req.body.city
    course.period = parseInt(req.body.period) || 8;
    course.id = modelCourse.getId();
    let curso_var = req.body.teacher;
    course.teacher = [];
    (async function() {
        for (let i = 0; i < curso_var.length; i++) {
            int = curso_var[i];
            let teachers = await modelTeacher.get_without_array({id: int, status: 1});
            if(teachers){
                course.teacher.push(teachers);
            }
        }
        let valid = new Course(course);
        valid.validate(error => {
        if(!error){
            modelCourse.insertCourse(course).then(result => {
                if(course.teacher.length < curso_var.length){
                res.status(201).send("Curso cadastrado mas informação de um id de professor digitado não exite")
                }else res.status(201).send("Curso Cadastrado com Sucesso.");
            });
        }else res.status(403).send("Os dados devem ser preenchidos");
        }) 
      })().catch(e => {
        console.error("Erro ao Criar Um Novo Curso", e);
        res.status(500).send("Erro ao Criar Um Novo Curso");
    })
}


exports.edit = (req, res) => {
    courses = {};
    courses.name = req.body.name;
    courses.teacher = [];
    courses.city = req.body.city;
    let teacher_var = [];
    teacher_var = req.body.teacher;
    courses.period = parseInt(req.body.period) || 8;
    courses.id = parseInt(req.params.id);
    courses.status = 1;
    let ide = parseInt(req.params.id);
    
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
            if(!result.value){
                res.status(404).send("Não foi encontrado curso para ser atualizado");
            }else{
                res.status(200).send("Curso modificado com sucesso");
                modelStudent.updateMany({ "course.id": ide }, { $set: { "course": courses }}).then(
                results => {
                    //console.log(course.teacher);   
                })
            }
            })
        }else res.status(401).send("Os dados devem ser preenchidos");
    })
    })().catch(err => {
        console.log(courses.teacher.length);
        console.error("Erro ao modificar o curso", err);
        res.status(401).send("Erro ao modificar o Curso");
    });
     //}
}

exports.delete = (req, res) => {
    let id = parseInt(req.params.id);
    
    modelCourse.deleta(id).then(info => {
    if(info.value){        
        modelStudent.updateMany({ "course.id": id }, { $set: { "status": 0 }});
            res.send("Curso excluido com sucesso");
    }else res.status(204).send("Não foi possivel excluir o curso");
    }).catch(err => {
        console.error("Ocorreu um erro ao deletar o curso da coleção");
        res.status(500);
    });
}