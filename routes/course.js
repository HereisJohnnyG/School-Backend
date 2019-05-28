const express = require('express');
const app = express.Router();
const app2 = require('./teacher.js');

var id = 0;

course = [];
//-------------------------------GET--------------------------------

app.get('/', function (req, res) {
  res.send(course);
})

app.get('/:id', function (req, res) {
  let id = req.params.id;
  let filteredstudent = course.filter ( (s) => {return (s.id == id)} );
  if(filteredstudent.length >= 1){
    res.send(filteredstudent[0]);
  }else{
    res.status(404);
    res.send("Curso não encontrado");
  }
})

//-------------------------------POST--------------------------------

app.post('/', function (req, res) {
  let curso = req.body;
  curso['id'] = ++id;
  
  if(curso.teacher){
      console.log(curso.teacher.length);
      let filteredteachers = curso.teacher.filter(element => { return app2.search_ID(element)!= ""});
      curso.teacher = filteredteachers;
      console.log(curso.teacher);
    for(let i = 0; i < curso.teacher.length; i++){
        curso.teacher[i] = app2.search_ID(curso.teacher[i]);
    }
  }
  course.push(curso);
  res.status(201).send("Curso cadastrado com sucesso");
})

//------------------------PUT------------------------------

app.put('/', function (req, res) {
  let curso = req.body;
   for(let i = 0; i < course.length; i ++){
     if(course[i].id == curso.id){
       console.log(course[i]);
       if(curso.teacher){
         for(let i = 0; i < curso.teacher.length; i++){
           curso.teacher[i] = app2.search_ID(curso.teacher[i]);
         }
       }
       course[i].name = curso.name || course[i].name;
       course[i].period = curso.period || course[i].period;
       course[i].city = curso.phd || course[i].city;
       course[i].teacher = curso.teacher || course[i].teacher;
       
     }  
   }
   res.send("Curso modificado com sucesso");
  
})




//-------------------------------DELETE--------------------------------
app.delete('/', function (req, res) {
  course = [];
  res.send("Todos os Curso foram removidos com sucesso");
})

app.delete('/:id', function (req, res) {
  let id = req.params.id;
  let filteredcourses = course.filter ( (s) => {return (s.id != id)} );
  if(course.length >= 1 && course.length != filteredcourses.length){
    course = filteredcourses;
    res.send("Curso deletado do sistema");
  }else{
    course = filteredcourses;
    res.status(404);
    res.send("Usuário não encontrado");
  }
})

//------------------------Functions------------------------------

function search_ID(ide) {
  let result = course.filter ( (s) => {return (s.id == ide)} );
  return(result);
}

//------------------------EXPORT------------------------------

module.exports = {app, search_ID};