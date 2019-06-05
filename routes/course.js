const express = require('express');
const app = express.Router();

const controller = require("../controller/course");

app.get('/', controller.getAll);
app.get('/:id', controller.getOne);
app.post('/', controller.post);
app.put('/:id', controller.edit);
app.delete('/:id', controller.delete);

module.exports = app;