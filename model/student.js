const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";

const mongoose = require("mongoose");
const Schema = require("../schema").studentSchema;
const Student = mongoose.model('Student', Schema, 'student');

var id;
Student.countDocuments({}, (err, count) => {
	id = count;
});

exports.getId = () => {
  return ++id;
}

exports.get = (where, collun) => {
    return Student.find(where, collun);
}

exports.updateStudent = (where, collun) => {
  return Student.findOneAndUpdate(where, { $set: { ...collun } });
}

exports.get_without_array = (where, collun) =>  {
  return Student.findOne(where, collun);
}

exports.updateCourse = (id) => {
    return Student.updateMany({}, {$pull: {course: {"id": id}}});
}

exports.insertStudent = (student) => {
    return Student.create(student);
}

exports.delete = (where, set) => {
    return Student.findOneAndUpdate(where, set); 
}

exports.replace = (where, set) => {
  return Student.updateMany(where, set);
}

exports.updateMany = (where, collun) => {
  return Student.updateMany(where, collun);
}