const mongoose = require("mongoose");
const Schema = require("../schema").studentSchema;
const Student = mongoose.model('Student', Schema, 'student');

var id;
Student.countDocuments({}, (err, count) => {
	id = count;
});

exports.getId = () => { return ++id; }

exports.setId = () => {return --id}

exports.get = (where, collun) => {
    return Student.find(where, collun).sort({id: 1});
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

exports.replace = (where, set, session) => {
  return Student.updateMany(where, set).session(session);
}

exports.updateMany = (where, collun) => {
  return Student.updateMany(where, collun);
}