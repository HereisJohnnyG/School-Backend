const express = require('express');
const app = express.Router();

const controller = require("../controller/json");

app.get('/user/', controller.user_getAll);
app.get('/user/:id', controller.user_getOne);

app.get('/teacher/', controller.teacher_getAll);
app.get('/teacher/:id', controller.teacher_getOne);

app.get('/course/', controller.course_getAll);
app.get('/course/:id', controller.course_getOne);

app.get('/student/', controller.student_getAll);
app.get('/student/:id', controller.student_getOne);




//------------JSON---------------------//
//app.get('/JSON/user', controller.getAll);




module.exports = app;