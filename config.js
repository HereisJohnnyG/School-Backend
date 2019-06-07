var mongoose = require('mongoose');

//---------------DATABASE CONNECTION ------------------------//
const dbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";

module.exports =function(){

  mongoose.connect(dbURL, { useNewUrlParser: true });

  mongoose.connection.on('connected', function(){
      console.log("Mongoose default connection is open to ", dbURL);
  });

  mongoose.connection.on('error', function(err){
      console.log(error("Mongoose default connection has occured "+err+" error"));
  });

  mongoose.connection.on('disconnected', function(){
      console.log(disconnected("Mongoose default connection is disconnected"));
  });

  process.on('SIGINT', function(){
      mongoose.connection.close(function(){
        //   console.log(termination("Mongoose default connection is disconnected due to application termination"));
        console.log('batata');
          process.exit(0)
      });
  });
}

