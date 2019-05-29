const express = require('express');
const app = express.Router();
const _curso = require('./course.js');
const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://Jeffereson:31524@cluster0-5rgko.mongodb.net/test?retryWrites=true";
var db;

mongoClient.connect(mdbURL, {native_parser:true}, (err, database) => {
  if(err){
    console.error("Ocorreu um erro ao conectar ao MongoDB");
    send.status(500); //Internal server error
  }
  else{
    db = database.db('trainee-prominas');
  }
});



var id = 0;

var students = [];
//-------------------------------GET--------------------------------
app.get('/', function (req, res) {
  db.collection('student').find({}).toArray( (err, estudantes) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection Student");
      send.status(500);
    }else res.send(estudantes);
    
  });
});

app.get('/:id', function (req, res) {
  let id = parseInt(req.params.id);
  db.collection('student').find({"id": id}).toArray( (err, estudantes) => {
    if(err){
      console.error("Ocorreu um erro ao conectar a collection Student");
      send.status(500);
    }else{
      if(estudantes == []){
        res.status(404).send("Usuário não encontrado");
      }else res.send(estudantes);
    } 
    
  });
});


//-------------------------------POST--------------------------------

app.post('/', function (req, res) {
  var student = req.body;
  student['id'] = ++id;


  if(student.course){
    console.log(student.course.length);
    let filteredcourses = student.course.filter(element => { return _curso.search_ID(element)!= ""});
    // student.course = filteredcourses;

    student.course = _curso.search_ID(filteredcourses[0])[0];

    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', filteredcourses[0], student.course);

    /*console.log('>>>>>FILTERED COURSES', student.course);
  for(let i = 0; i < student.course.length; i++){
    console.log('>>>>>>>>>>>>>>DENTRO DO LOOP', _curso.search_ID(student.course[i]));
    student.course[i] = _curso.search_ID(student.course[i]);
    console.log(student.course[i], );
  }*/
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
      console.log('fdesfwsefsfsafeavdagvrr', _curso.search_ID(estudantes.course[0]));
      students[index].course = _curso.search_ID(estudantes.course[0])[0];
      // for(let i = 0; i < estudantes.course.length; i++){
      //   estudantes.course[i] = _curso.search_ID(estudantes.course[i]);
      // }
    }
    students[index].name = estudantes.name || students[index].name;
    students[index].lastname = estudantes.lastname || students[index].lastname;
    students[index].age = estudantes.age || students[index].age;
    console.log('>>>>>>>>>>>>>>>>>>>>.', estudantes.course, students[index].course);
    //students[index].course = estudantes.course || students[index].course;
    error = false;
    res.send("Estudante cadastrado com sucesso");
  }else{
    res.status(404);
    res.send("Estudante não encontrado");
  }
});
//-------------------------------DELETE--------------------------------


app.delete('/', function (req, res) {
  db.collection('teacher').remove( {}, function(err, info){
    if(err){
      console.error("Ocorreu um erro ao deletar os usuários da coleção");
      res.status(500);
    }else{
      let n_removed = info.result.n;
      if(n_removed > 0){
        console.log("INF: Todos os usuários" + n_removed + "foram removidos");
        res.status(204).send("Todos os usuários foram removidos com sucesso");
      }else{
        console.log("Nenhum usuário foi removido");
        res.status(404).send("Nenhum usuário foi removido");
      } 
    } 
  });
});

app.delete('/:id', function (req, res) {
  let id = parseInt(req.params.id);

  db.collection('student').remove( {"id": id}, true, function(err, info){
    if(err){
      console.error("Ocorreu um erro ao deletar os professores da coleção");
      res.status(500);
    }else{
      let n_removed = info.result.n;
      if(n_removed > 0){
        res.status(204)
        res.send("Todos os professores foram removidos com sucesso");
        console.log("INF: Todos os professores" + n_removed + "foram removidos");
      }else{
        console.log("Nenhum professores foi removido");
        res.status(404).send("Nenhum professores foi removido");
      } 
    } 
  });
})





//------------------------EXPORT------------------------------

module.exports = app;