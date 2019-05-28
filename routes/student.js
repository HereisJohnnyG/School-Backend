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

app.put('/:id', function (req, res) {


  let id = parseInt(req.params.id);
  let estudantes = req.body;
  let filteredstudent = students.filter ( (s) => {return (s.id == id)} );
  let index = students.indexOf(filteredstudent[0]);
  console.log(index, filteredstudent[0], estudantes);
  if(index >= 0){
    if(estudantes.course){
      for(let i = 0; i < estudantes.course.length; i++){
        estudantes.course[i] = _curso.search_ID(estudantes.course[i])[0];
      }
    }
    students[index].name = estudantes.name || students[index].name;
    students[index].lastname = estudantes.lastname || students[index].lastname;
    students[index].age = estudantes.age || students[index].age;
    students[index].course = estudantes.course || students[index].course;
    error = false;
    res.send("Estudante cadastrado com sucesso");
  }else{
    res.status(404);
    res.send("Estudante não encontrado");
  }
});
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
    res.send("Estudante removido do sistema");
  }else{
    students = filteredstudent;
    res.status(404);
    res.send("Estudante não encontrado");
  }
})





//------------------------EXPORT------------------------------

module.exports = app;