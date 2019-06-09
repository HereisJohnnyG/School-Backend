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
    db.collection('users').find({}).toArray((err, user) =>{id = user.length});
  }
});

getId = () => {return ++id}

exports.get = (where, collun) =>  {
    return database.user.find(where, collun);
}

exports.insert = (document) => {
    return database.user.create(document);
}

exports.troca = (id, document) => {
    return database.user.updateOne({"id": id, "status": 1}, {$set: document});
}
exports.deleta = (id) => {
    return database.user.findOneAndUpdate({"id": id, "status": 1}, {$set: {status: 0}});
}

