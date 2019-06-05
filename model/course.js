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
    db.collection('course').find({}).toArray((err, user) =>{id = user.length});
  }
});


exports.getId = () => {return ++id}

exports.get = (where, collun) =>  {
    return db.collection('course').find(where, collun).toArray();
}

exports.get_todos = () =>  {
  return db.collection('course').find({"status": 1}).toArray();
}

exports.get_without_array = (where, collun) =>  {
  return db.collection('course').findOne(where, collun);
}

exports.insertCourse = (course) => {
  return db.collection('course').insertOne(course);
}


exports.updateCourse = (ide, collun) => {

  return db.collection('course').findOneAndUpdate(ide, { $set: collun } );
  // return db.collection('course').findOneAndUpdate(ide, collun);
}

exports.updateMany = (id, collun) => {
  return db.collection('course').updateMany(id,collun);
}

exports.deleta = (id) => {
    return db.collection('course').findOneAndUpdate({"id": id, "status": 1}, {$set: {status: 0}});
}