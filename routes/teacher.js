const express = require('express');
const app = express.Router();

id = 0;
var teacher = [{"id": ++id, "name": "Marcos", "lastname":"Gomes", "phd": true},
            {"id": ++id, "name": "Antonio", "lastname":"Nunes", "phd": false},
            {"id": ++id, "name": "John", "lastname":"Doe", "phd": true}
]

app.get('/', function (req, res) {
  res.send(teacher);
})

app.post('/', function (req, res) {
  var professor = req.body;
  teacher['id'] = ++id;
  teacher.push(professor);
  res.send("Professor cadastrado com sucesso");
})

app.delete('/', function (req, res) {
  teacher = [];
  res.send("Todos os Professor foram removidos com sucesso");
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

function search_ID(ide) {
    let result = teacher.filter ( (s) => {return (s.id == ide)} );
    return(result);
}

app.post('/', function (req, res) {
  res.sendStatus(429);
})

module.exports = {app, search_ID};
