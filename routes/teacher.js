const express = require('express');
const app = express.Router();

id = 0;
var teacher = [{"name": "Marcos", "lastname":"Gomes", "phd": true, "id": ++id},
            {"name": "Antonio", "lastname":"Nunes", "phd": false, "id": ++id},
            {"name": "John", "lastname":"Doe", "phd": true, "id": ++id}
]

//-------------------------------GET--------------------------------

app.get('/', function (req, res) {
  res.send(teacher);
})


app.get('/:id', function (req, res) {
  let idprov = req.params.id;
  let filteredstudent = teacher.filter ( (s) => {return (s.id == idprov)} );
  if(filteredstudent.length >= 1){
    res.send(filteredstudent[0]);
  }else{
    res.status(404);
    res.send("Professor não encontrado");
  }
})

//------------------------POST------------------------------

app.post('/', function (req, res) {
  var professor = req.body;
  teacher['id'] = ++id;
  teacher.push(professor);
  res.status(201).send("Professor cadastrado com sucesso");
})

//------------------------PUT------------------------------

app.put('/', function (req, res) {
  let prof = req.body;
  console.log(prof.length);
  for(let i = 0; i < teacher.length; i ++){
    console.log(teacher[i].id);
    if(teacher[i].id == prof.id){
      teacher[i].name = prof.name || teacher[i].name;
      teacher[i].lastname = prof.lastname || teacher[i].lastname;
      teacher[i].phd = prof.phd || teacher[i].phd;
      
    }  
  }
  res.send("Professor modificado com sucesso");
})


//------------------------DELETE------------------------------
app.delete('/', function (req, res) {
  teacher = [];
  res.send("Todos os Professor foram removidos com sucesso");
})

app.delete('/:id', function (req, res) {
  let id = req.params.id;
  let filteredteachers = teacher.filter ( (s) => {return (s.id != id)} );
  if(teacher.length >= 1 && teacher.length != filteredteachers.length){
    teacher = filteredteachers;
    res.send(teacher);
  }else{
    teacher = filteredteachers;
    res.status(404);
    res.send("Usuário não encontrado");
  }
})


//------------------------Functions------------------------------

function search_ID(ide) {
    let result = teacher.filter ( (s) => {return (s.id == ide)} );
    return(result);
}


//------------------------EXPORT------------------------------
module.exports = {app, search_ID};
