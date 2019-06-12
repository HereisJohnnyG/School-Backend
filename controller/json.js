const modelUser = require("../model/user");
const modelCourse = require("../controller/course");
const modelStudent = require("../controller/student");
const modelTeacher = require("../controller/teacher");

//--------------USER-----------------//
exports.user_getAll = (req, res) => {
    return modelUser.getAll(req, res);
}

exports.user_getOne = (req, res) => {
    return modelUser.getOne(req, res);
}

//--------------TEACHER---------------//
exports.teacher_getAll = (req, res) => {
    return modelTeacher.getAll(req, res);
}
exports.teacher_getOne = (req, res) => {
    return modelTeacher.getOne(req, res);
}

//--------------Course-----------------//
exports.course_getAll = (req, res) => {
    return modelCourse.getAll(req, res);
}

exports.course_getOne = (req, res) => {
    return modelCourse.getOne(req, res);
}

//--------------Student-----------------//
exports.student_getAll = (req, res) => {
    return modelStudent.getAll(req, res);
}
exports.student_getOne = (req, res) => {
    return modelStudent.getOne(req, res);
}


