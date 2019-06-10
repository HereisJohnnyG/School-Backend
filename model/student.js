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
    db.collection('students').find({}).toArray((err, user) =>{id = user.length});
  }
});

exports.getId = () => {
  return ++id;
}

exports.get = (where, collun) => {
    return database.student.find(where, collun).populate({
      path: 'course',
      model: 'course'
 });
}

exports.updateStudent = (where, collun) => {
  return database.student.findOneAndUpdate(where, { $set: { ...collun } });
}

exports.get_without_array = (where, collun) =>  {
  return database.student.findOne(where, collun);
}

exports.updateCourse = (id) => {
    return database.student.updateMany({}, {$pull: {course: {"id": id}}});
}

exports.insertStudent = (student) => {
    return database.student.create(student);
}

exports.delete = (where, set) => {
    return database.student.findOneAndUpdate(where, set); 
}

exports.replace = (where, set) => {
  return database.student.updateMany(where, set);
}

exports.updateMany = (where, collun) => {
  return database.student.updateMany(where, collun);
}