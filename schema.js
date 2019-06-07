var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema({
    id: {
      type: Number,
      index: true,
      require: true,
      unique: true
    },
    status: {
      type: Number,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    lastname: {
      type: String,
      require: true
    },
    profile: {
      type: Number,
      require: true
    }
});

var user = mongoose.model('user', userSchema);

teacherSchema = new Schema({
    id: {
        type: Number,
        index: true,
        require: true,
        unique: true
    },
    status: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    phd: {
        type: Boolean
    }
})

var teacher = mongoose.model('teacher', teacherSchema);

courseSchema = new Schema({
    id: {
        type: Number,
        index: true,
        require: true,
        unique: true
    },
    status: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    period: {
        type: Number,
        default: 8
    },
    teacher: {
        type: Schema.Types.ObjectId, 
        ref: 'teacher'
    }
})

var course = mongoose.model('course', courseSchema);


studentSchema = new Schema({
    id: {
        type: Number,
        index: true,
        require: true,
        unique: true
    },
    status: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        min: [17, 'Too young'],
    },
    course: {
        type: Schema.Types.ObjectId, 
        ref: 'course'
    }
})

student = mongoose.model('student', studentSchema);

module.exports = {user, teacher, course, student}