const express = require('express');
const app = express.Router();
const _curso = require('./course.js');

var id = 0;

var students = [];
//-------------------------------GET--------------------------------
app.get('/', function (req, res) {
  res.send(students);
})

app.get('/:id', function (req, res) {
  let id = req.params.id;
  let filteredstudent = students.filter ( (s) => {return (s.id == id)} );
  if(filteredstudent.length >= 1){
    res.send(filteredstudent[0]);
  }else{
    res.status(404);
    res.send("Estudante não encontrado");
  }
})


//-------------------------------POST--------------------------------

app.post('/', function (req, res) {
  var student = req.body;
  student['id'] = ++id;


  if(student.course){
    console.log(student.course.length);
    let filteredcourses = student.course.filter(element => { return _curso.search_ID(element)!= ""});
    student.course = filteredcourses;
    console.log(student.course);
  for(let i = 0; i < student.course.length; i++){
    student.course[i] = _curso.search_ID(student.course[i]);
  }
}

  console.log(student);
  students.push(student);
  res.status(201).send("Estudante cadastrado com sucesso");
})

//-------------------------------PUT--------------------------------

app.put('/', function (req, res) {
  let error = true;
  let estudante = req.body;
  //console.log(usuario.id);
  console.log(students.length);
  for(let i = 0; i < students.length; i ++){
    if(students[i].id == estudante.id){
      console.log(students[i].id);
      if(estudante.course){
        for(let i = 0; i < estudante.course.length; i++){
          estudante.course[i] = _curso.search_ID(estudante.course[i]);
        }
      }
      students[i].name = estudante.name || students[i].name;
      students[i].lastname = estudante.lastname || students[i].lastname;
      students[i].age = estudante.age || students[i].age;
      students[i].course = estudante.course || students[i].course;
      error = false;
    }  
  }
  if(!error){
    res.send("Usuário modificado com sucesso");
  }else res.status(404).send("Não foi possivel modificar o estudante");
})


//-------------------------------DELETE--------------------------------


app.delete('/', function (req, res) {
  students = [];
  res.send("Todos os estudante foram removidos com sucesso");
})

app.delete('/:id', function (req, res) {
  let id = req.params.id;
  let filteredstudent = students.filter ( (s) => {return (s.id != id)} );
  if(students.length >= 1 && students.length != filteredstudent.length){
    students = filteredstudent;
    res.send(students);
  }else{
    students = filteredstudent;
    res.status(404);
    res.send("Estudante não encontrado");
  }
})





//------------------------EXPORT------------------------------

module.exports = app;