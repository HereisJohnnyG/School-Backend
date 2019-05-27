const express = require('express')
const bodyParser = require('body-parser')
const app = express()
 
app.use(bodyParser.json())

var students = [{"nome": "Marcos", "idade": "23"},
	{"nome": "Pedro", "idade": "27"},
	{"nome": "Lucas", "idade": "20"}
]

app.get('/', function (req, res) {
  res.send('Hello World - Jefferson Gandra')
})

app.get('/students', function (req, res) {
  res.send(students);
})

app.post('/students', function (req, res) {
  var student = req.body;
  students.push(student);
  res.send("Estudante cadastrado com sucesso");
})

app.delete('/students', function (req, res) {
  students = [];
  res.send("Todos os estudante foram removidos com sucesso");
})

app.get('/students/:name', function (req, res) {
  let name = req.params.name;
  let filteredstudent = students.filter ( (s) => {return (s.nome == name)} );
  if(filteredstudent.length >= 1){
    res.send(filteredstudent[0]);
  }else{
    res.status(404);
    res.send("Estudante não encontrado");
  }
  res.send(name);
})


app.post('/', function (req, res) {
  res.sendStatus(429);
})
 
app.listen(process.env.PORT);
