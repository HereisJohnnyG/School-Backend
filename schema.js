var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema({
    id: {
      type: Number,
      require: true,
      unique: true
    },
    status: {
      type: Number,
      default: 1,
      enum: [0, 1],
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
      type: String,
      enum: ["admin", "guess"],
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
        enum: [0, 1],
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
        type: Boolean,
        validate: [val => {return val === true},  'O professor deve possuir PHD']
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
        enum: [0, 1],
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
        type: [teacherSchema], 
        validate: [val => {return val.length >= 2}, 'São necessários pelo menos 2 professores válidos']
    },
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
        enum: [0, 1],
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
        min: [17, 'Muito novo'],
    },
    course: {
        type: courseSchema, 
        ref: 'course',
        validate: [val => {return val != undefined}, 'Curso deve ser diferente de null'],
        require: true
    }
})

student = mongoose.model('student', studentSchema);

//module.exports = {user, teacher, course, student}

module.exports = {userSchema, teacherSchema, courseSchema, studentSchema}