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
    db.collection('user').find({}).toArray((err, user) =>{id = user.length});
  }
});

exports.getId = () => {return ++id}

exports.get = (where, collun) =>  {
    return db.collection('user').find(where, collun).toArray();
}

exports.insert = (document) => {
    return db.collection('user').insertOne(document);
}

exports.troca = (id, document) => {
    return db.collection('user').updateOne({"id": id, "status": 1}, {$set: document});
}
exports.deleta = (id) => {
    return db.collection('user').findOneAndUpdate({"id": id, "status": 1}, {$set: {status: 0}});
}

