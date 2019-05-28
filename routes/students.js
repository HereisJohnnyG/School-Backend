const express = require('express');
const app = express.Router();
const curso = require('./course.js');

var id = 0;

var students = [{"id": ++id, "name": "Marcos", "lastname": "Gomes", "age": "23", "course": "Engenharia"},
{"id": ++id, "name": "Jose", "lastname": "Gomes", "age": "23", "course": "Engenharia"},
{"id": ++id, "name": "Gustavo", "lastname": "Gomes", "age": "23", "course": "Engenharia"},
]
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
    let filteredcourses = student.course.filter(element => { return curso.search_ID(element)!= ""});
    student.course = filteredcourses;
    console.log(student.course);
  for(let i = 0; i < student.course.length; i++){
    student.course[i] = curso.search_ID(student.course[i]);
  }
}


  students.push(student);
  res.send("Estudante cadastrado com sucesso");
})


//-------------------------------DELETE--------------------------------


app.delete('/', function (req, res) {
  students = [];
  res.send("Todos os estudante foram removidos com sucesso");
})

app.delete('/:name', function (req, res) {
  let name = req.params.name;
  let filteredstudent = students.filter ( (s) => {return (s.name != name)} );
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