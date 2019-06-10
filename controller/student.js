const modelStudent = require("../model/student");
const modelCourse = require("../model/course");
const mongoose = require('mongoose');

exports.getAll = (req, res) => {
    let where = {status:1};
    let collun = {"_id": 0, "status": 0, "course._id": 0, "course.status": 0, "course.teacher._id": 0, "course.teacher.status": 0};
    modelStudent.get(where, collun).then(estudantes =>{
    if(estudantes == []){
        res.status(204).send("Usuário não encontrado");
    }else res.send(estudantes);
    }).catch(err => {
        console.error("Ocorreu um erro ao conectar a collection Student");
        send.status(500);
    })
}
  
exports.getOne = (req, res) => {
    let id = parseInt(req.params.id);
    let where = {"id": id, status:1};
    let collun = {"_id": 0, "status": 0, "course._id": 0, "course.status": 0, "course.teacher._id": 0, "course.teacher.status": 0};
    modelStudent.get(where, collun).then(estudantes =>{
    if(estudantes == []){
        res.status(204).send("Usuário não encontrado");
    }else res.send(estudantes);
    }).catch(err => {
        console.error("Ocorreu um erro ao conectar a collection Student");
        send.status(500);
    })
} 


exports.post = (req, res) => {
    let students = {};
    students.name = req.body.name;
    students.lastname = req.body.lastname;
    students.age = req.body.age;
    students.course = [];
    let student_temp = [];
    student_temp.push(req.body.course);
    students.status = 1;
    students.id = modelStudent.getId();

    if(students.name && students.lastname && students.age && req.body.course && students.age >= 17){
        
        (async function() {
            for (let i = 0; i < student_temp.length; i++) {
                let int = student_temp[i];
                let courses = await modelCourse.get_without_array({id: int, status: 1});
                if(courses){
                    students.course.push( mongoose.Types.ObjectId(courses._id) );
                }
            }
            if(students.course.length > 0){
                //console.log('------->',students.course);
                modelStudent.insertStudent(students).then( result => {
                  res.status(201).send("Estudante Cadastrado com Sucesso.");
                }).catch(err => {
                    console.error("Erro ao cadastrar um novo estudante", err);
                    res.status(401).send("Erro ao criar Um novo estudante");
                })
            }else res.status(401).send("Erro ao criar Um novo estudante, curso invalido");
        })();
        }else{res.status(401).send("Erro ao Criar Um Novo estudante, campo invalido");}
}


exports.delete = (req, res) => {
    let id = parseInt(req.params.id);
    where = {"id": id, "status": 1};
    set = {$set: {status: 0}}
    modelStudent.delete(where, set).then(results => { 
      if(results.value == null) {
        res.status(204).send("Não foi possivel encontrar o usuário")
      }else res.send("Estudante excluido com sucesso");
    }).catch(e => {
        console.error("Ocorreu um erro ao deletar os estudante da coleção");
        res.status(500);
    })
}

exports.edit = (req, res) => {
    let students = {};
    students.name = req.body.name;
    students.lastname = req.body.lastname;
    students.age = req.body.age;
    students.course = [];
    let student_temp = []; 
    student_temp.push(req.body.course);

    if(students.name && students.lastname && students.age >= 17 && student_temp.length == 1){
    let id = parseInt(req.params.id);
    students.id = parseInt(req.params.id);
    let ide = parseInt(req.params.id);
    if(students =={}){
        res.status(400).send("Solicitação não autorizada");
    }else{
        (async function() {

        for (let i = 0; i < student_temp.length; i++) {
            let int = student_temp[i];
            int = student_temp[i];
            let courses = await modelCourse.get_without_array({id: int, status: 1});
            if(courses){
                students.course.push( mongoose.Types.ObjectId(courses._id));
            }
        }
        if(students.course.length > 0){
            let where = {"id": ide, "status": 1};
            //let collun = { $set: {students} };
            //console.log(ide);
            modelStudent.updateStudent(where,students)
            .then(result => {
                if(result){ res.status(200).send("Estudante editado com Sucesso.");}
                else{  res.status(401).send("Estudante não encontrado");}
            })
        }else{
            res.status(401).send("Necessário cadastrar um curso válido para o aluno");
        }
        })().catch(e => {
            console.error("erro ao editar Estudante:", e);
            res.status(401).send("Ocorreu um erro ao editar Estudante:");
        });
  }
}else res.status(401).send("Campo inválido");
}