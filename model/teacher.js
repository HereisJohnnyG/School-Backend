const mongoClient = require("mongodb").MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-th9se.mongodb.net/test?retryWrites=true&w=majority";


const mongoose = require("mongoose");
const Schema = require("../schema").teacherSchema;
const Teacher = mongoose.model('Teacher', Schema, 'teacher');


var id;
Teacher.countDocuments({}, (err, count) => {
	id = count;
});

exports.getId = () => {return ++id}

exports.setId = () => {return --id}

exports.get = (where, collun) =>  {
    return Teacher.find(where, collun).sort({id: 1});
}

exports.get_without_array = (where, collun) =>  {
  return Teacher.findOne(where, collun);
}

exports.insert = (document) => {
    return Teacher.create(document);
}

exports.troca = (where, document) => {
    return Teacher.findOneAndReplace(where, document);
}

exports.deleta = (where) => {
    return Teacher.findOneAndUpdate(where, {$set: {status: 0}});
}