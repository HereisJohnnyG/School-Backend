const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";

var db, id;

mongoClient.connect(mdbURL, {useNewUrlParser: true}, (err, database) => {
  if(err){
    console.error("Ocorreu um erro ao conectar ao MongoDB");
    send.status(500); //Internal server error
  }
  else{
    db = database.db('trainee-prominas');
    db.collection('student').find({}).toArray((err, user) =>{id = user.length});
  }
});

exports.getId = () => {
  return ++id;
}

exports.get = (where, collun) => {
    return db.collection('student').find(where, collun).toArray();
}

exports.updateStudent = (where, collun) => {
  return db.collection('student').findOneAndUpdate(where, { $set: { ...collun } });
}

exports.get_without_array = (where, collun) =>  {
  return db.collection('student').findOne(where, collun);
}

exports.updateCourse = (id) => {
    return db.collection('student').updateMany({}, {$pull: {course: {"id": id}}});
}

exports.insertStudent = (student) => {
    return db.collection('student').insertOne(student);
}

exports.delete = (where, set) => {
    return db.collection('student').findOneAndUpdate(where, set); 
}

exports.replace = (where, set) => {
  return db.collection("student").updateMany(where, set);
}

exports.updateMany = (where, collun) => {
  return db.collection('student').updateMany(where, collun);
}