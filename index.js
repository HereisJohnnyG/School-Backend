const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require("mongodb").MongoClient;
const app = express();
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";

mongoClient.connect(mdbURL, {useNewUrlParser: true}, (err, database) => {
  if(err){
    console.error("Ocorreu um erro ao conectar ao MongoDB");
    send.status(500); //Internal server error
  }
  else{
    db = database.db('trainee-prominas');
  }
});







const baseAPI = "/api/v1";


app.use(bodyParser.json());

app.get(baseAPI, function (req, res) {
  res.send('Hello World!');
});

app.post(baseAPI, function (req, res) {
  res.send('Hello World');
});


// ROUTE CONFIGURATION

app.use(`${baseAPI}/student`, require('./routes/student'));
app.use(`${baseAPI}/course`, require('./routes/course'));
app.use(`${baseAPI}/teacher`, require('./routes/teacher'));
app.use(`${baseAPI}/user`, require('./routes/user'));


//Listening on Heroku or localhost:3000

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on PORT ${listener.address().port}`);
});
