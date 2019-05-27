const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const baseAPI = "/api/v1";


app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/', function (req, res) {
  res.send('Hello World');
});

app.use(`${baseAPI}/students`, require('./routes/students'));
//app.use(`${baseAPI}/users`, require('./routes/users'));

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on PORT ${listener.address().port}`);
});
