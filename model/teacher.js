const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";
const database = require('../schema');


var db, id;

mongoClient.connect(mdbURL, {useNewUrlParser: true}, (err, database) => {
  if(err){
    console.error("Ocorreu um erro ao conectar ao MongoDB");
    send.status(500); //Internal server error
  }
  else{
    db = database.db('trainee-prominas');
    db.collection('teachers').find({}).toArray((err, teacher) =>{id = teacher.length});
  }
});

exports.getId = () => {return ++id}

exports.get = (where, collun) =>  {
  return database.teacher.find(where, collun);
}

exports.get_without_array = (where, collun) =>  {
  return database.teacher.findOne(where, collun);
}

exports.insert = (document) => {
    return database.teacher.create(document);
}

exports.troca = (where, document) => {
    return database.teacher.findOneAndReplace(where, document);
}

exports.deleta = (where) => {
    return database.teacher.findOneAndUpdate(where, {$set: {status: 0}});
}