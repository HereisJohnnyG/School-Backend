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
  professor['id'] = ++id;
  teacher.push(professor);
  res.status(201).send("Professor cadastrado com sucesso");
})

//------------------------PUT------------------------------

app.put('/:id', function (req, res) {


  let prof = req.body;
  //console.log(usuario.id);
  let id = parseInt(req.params.id);
  let filteredprof = teacher.filter ( (s) => {return (s.id == id)} );
  let index = teacher.indexOf(filteredprof[0]);
  //console.log(index, filteredstudent[0], usuarios);
  if(index >= 0){
    teacher[index].name = prof.name || teacher[index].name;
    teacher[index].lastname = prof.lastname || teacher[index].lastname;
    teacher[index].phd = prof.phd || teacher[index].phd; 
      res.send("Professor modificado com sucesso");
  }else res.status(404).send("Professor não encontrado");
});



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
    res.send("Professor removido do sistema");
  }else{
    teacher = filteredteachers;
    res.status(404);
    res.send("Professor não encontrado");
  }
})


//------------------------Functions------------------------------

function search_ID(ide) {
    let result = teacher.filter ( (s) => {return (s.id == ide)} );
    return(result);
}


//------------------------EXPORT------------------------------
module.exports = {app, search_ID};
