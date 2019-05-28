const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const baseAPI = "/api/v1";


app.use(bodyParser.json());

app.get(baseAPI, function (req, res) {
  res.send('Hello World!');
});

app.post(baseAPI, function (req, res) {
  res.send('Hello World');
});

app.use(`${baseAPI}/student`, require('./routes/student'));
app.use(`${baseAPI}/course`, require('./routes/course').app);
app.use(`${baseAPI}/teacher`, require('./routes/teacher').app);
app.use(`${baseAPI}/user`, require('./routes/user'));

const listener = app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on PORT ${listener.address().port}`);
});
