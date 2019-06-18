const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const conn = require('./config')
const cors = require('cors');

conn();


const baseAPI = "/api/v1";

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.get(baseAPI, function (req, res) {
  res.status(200).send('Hello World!');
});

app.post(baseAPI, function (req, res) {
  res.status(200).send('Hello World');
});


// ROUTE CONFIGURATION

app.use(`${baseAPI}/student`, require('./routes/student'));
app.use(`${baseAPI}/course`, require('./routes/course'));
app.use(`${baseAPI}/teacher`, require('./routes/teacher'));
app.use(`${baseAPI}/user`, require('./routes/user'));

//------------------JSON-----------------------------------//
app.use(`${baseAPI}/JSON`, require('./routes/json'));


//Listening on Heroku or localhost:3000

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on PORT ${listener.address().port}`);
});

module.exports = app;