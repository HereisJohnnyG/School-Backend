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
    db.collection('courses').find({}).toArray((err, user) =>{id = user.length});
  }
});


exports.getId = () => {return ++id}

exports.get = (where, collun, collun_pop) =>  {
    return database.course.find(where, collun).populate('teacher', collun_pop);
}

exports.get_todos = () =>  {
  return database.course.find({"status": 1});
}

exports.get_without_array = (where, collun) =>  {
  return database.course.findOne(where, collun);
}

exports.insertCourse = (course) => {
  return database.course.create(course);
}


exports.updateCourse = (ide, collun) => {

  return database.course.findOneAndUpdate(ide, { $set: collun } );
  // return database.course.findOneAndUpdate(ide, collun);
}

exports.updateMany = (id, collun) => {
  return database.course.updateMany(id,collun);
}

exports.deleta = (id) => {
    return database.course.findOneAndUpdate({"id": id, "status": 1}, {$set: {status: 0}});
}