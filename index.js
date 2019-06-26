const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const conn = require('./config')
const cors = require('cors');
const jwt = require('express-jwt');
var jwks = require('jwks-rsa');

conn();

const baseAPI = "/api/v1";

const baseAPI_Auth = "/api/v1.1";

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-47b3881g.auth0.com/.well-known/jwks.json'
  }),
  audience: 'sadadad',
  issuer: 'https://dev-47b3881g.auth0.com/',
  algorithms: ['RS256']
})

app.use(jwtCheck);
app.use( jwtCheck.unless({path: `${baseAPI}`}) );


app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

app.get(`${baseAPI}/protected`,
  function(req, res) {
    if (!req.user.admin) return res.sendStatus(401);
    res.sendStatus(200);
});

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.get(baseAPI, function (req, res) {
  res.status(200).json('Hello World!');
});

app.post(baseAPI, function (req, res) {
  res.status(200).json('Hello World');
});


// ROUTE CONFIGURATION

app.use(`${baseAPI}/student`, require('./routes/student'));
app.use(`${baseAPI}/course`, require('./routes/course'));
app.use(`${baseAPI}/teacher`, require('./routes/teacher'));
app.use(`${baseAPI}/user`, require('./routes/user'));

//------------------JSON-----------------------------------//
app.use(`${baseAPI}/JSON`, require('./routes/json'));


// ROUTE CONFIGURATION

app.use(`${baseAPI_Auth}/student`, require('./routes/student'));
app.use(`${baseAPI_Auth}/course`, require('./routes/course'));
app.use(`${baseAPI_Auth}/teacher`, require('./routes/teacher'));
app.use(`${baseAPI_Auth}/user`, require('./routes/user'));

//------------------JSON-----------------------------------//
app.use(`${baseAPI_Auth}/JSON`, require('./routes/json'));


//Listening on Heroku or localhost:3000

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on PORT ${listener.address().port}`);
});

module.exports = app;