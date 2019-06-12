var mongoose = require('mongoose');

//---------------DATABASE CONNECTION ------------------------//
const dbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/trainee-prominas?retryWrites=true&w=majority";

module.exports = function(){

  //Connection
  mongoose.connect(dbURL, { useNewUrlParser: true });

  mongoose.connection.on('connected', function(){
      mongoose.set('useFindAndModify', false);
      console.log("Mongoose default connection is open to ", dbURL);
  });

  mongoose.connection.on('error', function(err){
      console.log("Mongoose default connection has occured "+err+" error");
  });

  mongoose.connection.on('disconnected', function(){
      console.log("Mongoose default connection is disconnected");
  });

  process.on('SIGINT', function(){
    mongoose.connection.close(function(){
      //   console.log(termination("Mongoose default connection is disconnected due to application termination"));
      console.log('Encerrando a conexão');
      process.exit(0)
    });
  });
}