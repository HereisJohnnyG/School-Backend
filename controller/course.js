const modelCourse = require("../model/course");
const modelStudent = require("../model/student");
const modelTeacher = require("../model/teacher");

exports.getAll = (req, res) => {
    let courses;
    let where = {"status": 1};
    let collun = {projection: {'_id': 0, 'status':0, 'teacher.status': 0, 'teacher._id': 0}};
    modelCourse.get(where,collun).then(
        users => {
            res.send(users);
            if(courses == []){
                res.status(404).send("Curso não encontrado");
            }
            else res.send(courses);
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
        users => {
            res.send(users);
            if(courses == []){
                res.status(404).send("Curso não encontrado");
            }
            else res.send(courses);
        } 
    ).catch(err => {
        console.log(err);
        console.error("Ocorreu um erro ao procurar o curso");
        res.status(500).send("Ocorreu um erro ao procurar o curso");
    });
}

exports.post = (req, res) => {
    course = {};
    if(req.body.name && req.body.city && (req.body.teacher.length >= 2)){
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
        modelCourse.insertCourse(course).then(result => {
            if(course.teacher.length < curso_var.length){
              res.status(201).send("Curso cadastrado mas informação de um id de professor digitado não exite")
            }else res.status(201).send("Curso Cadastrado com Sucesso.");
        });
      })().catch(e => {
        console.error("Erro ao Criar Um Novo Curso", e);
        res.status(500).send("Erro ao Criar Um Novo Curso");
    })
}else res.status(403).send("Os dados devem ser preenchidos");
}


exports.edit = (req, res) => {
    courses = {};
    courses.name = req.body.name;
    courses.teacher = [];
    courses.city = req.body.city;
    teacher_var = req.body.teacher
    courses.period = parseInt(req.body.period) || 8;
    if(courses.name && courses.city){
      courses.id = parseInt(req.params.id);
      courses.status = 1;
      let ide = parseInt(req.params.id);
      
        (async function() {
            console.log("---------------------");
          for (let i = 0; i < teacher_var.length; i++) {
            int = teacher_var[i];
            let teachers = await modelTeacher.get_without_array({id: int, status: 1});
            if(teachers != null){
              courses.teacher.push(teachers);
            }
          }
          where = {"id": ide};
          // collun = { $set: {...courses} };
          //console.log(where, collun);
          console.log(courses);
          modelCourse.updateCourse(where, courses).then(result => {
            if(!result.value){
                res.send("Não foi encontrado curso para ser atualizado");
            }else{
                console.log(ide, courses);
                modelStudent.updateMany({ "course.id": ide }, { $set: { "course": courses }}).then(
                results => {
                    
                    res.send("Curso modificado com sucesso");
              })
          }}).catch(err => {
            console.error("Erro ao Criar Um Novo Curso", err);
            res.status(201).send("Erro ao Criar Um Novo Curso");
          })
        })(); 
     }else res.status(403).send("Os dados devem ser preenchidos");
}

exports.delete = (req, res) => {
    let id = parseInt(req.params.id);
    
    modelCourse.deleta(id).then(info => {
    if(info.value){        
        modelStudent.updateMany({ "course.id": id }, { $set: { "status": 0 }});
            res.send("Curso excluido com sucesso");
    }else res.send("Não foi possivel excluir o curso");
    }).catch(err => {
        console.error("Ocorreu um erro ao deletar o curso da coleção");
        res.status(500);
    });
}