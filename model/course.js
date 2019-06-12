const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";

const mongoose = require("mongoose");
const Schema = require("../schema").courseSchema;
const Course = mongoose.model('Course', Schema, 'course');


var id;
Course.countDocuments({}, (err, count) => {
	id = count;
});


exports.getId = () => {return ++id}

exports.setId = () => {return --id}

exports.get = (where, collun) =>  {
    return Course.find(where, collun).sort({id: 1});
}

exports.get_todos = () =>  {
  return Course.find({"status": 1});
}

exports.get_without_array = (where, collun) =>  {
  return Course.findOne(where, collun);
}

exports.insertCourse = (course) => {
  return Course.create(course);
}


exports.updateCourse = (ide, collun) => {
  return Course.findOneAndUpdate(ide, { $set: collun } );
}

exports.updateMany = (id, collun) => {
  return Course.updateMany(id,collun);
}

exports.deleta = (id) => {
    return Course.findOneAndUpdate({"id": id, "status": 1}, {$set: {status: 0}});
}