var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// User schema and Model


userSchema = new Schema({
    id: {
      type: Number,
      require: true
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
      enum: {values: ["admin", "guess"], message:"Profile deve ser admin ou guess"},
      require: true
    }
}, {versionKey: false});

var user = mongoose.model('user', userSchema);

// teacher schema and Model


teacherSchema = new Schema({
    id: {
        type: Number,
        require: true
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
        validate: [val => {return val === true}, 'O professor deve possuir PHD para ser cadastrado']
    }
}, {versionKey: false})

var teacher = mongoose.model('teacher', teacherSchema);

// Course schema and Model

courseSchema = new Schema({
    id: {
        type: Number,
        require: true
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
    city: {
        type: String
    },
    teacher: {
        type: [teacherSchema], 
        validate: [val => {return val.length >= 2}, 'São necessários pelo menos 2 professores válidos']
    },
}, {versionKey: false})

var course = mongoose.model('course', courseSchema);

// Student Schema and Model

studentSchema = new Schema({
    id: {
        type: Number,
        require: true
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
        min: [17, 'Idade inválida, idade minima é de 17 anos'],
    },
    course: {
        type: [courseSchema],
        require: true,
        validate: [val => {return val.length == 1}, 'Deve ser cadastrado um curso válido']
    }
}, {versionKey: false})

student = mongoose.model('student', studentSchema);

//module.exports = {user, teacher, course, student}

module.exports = {userSchema, teacherSchema, courseSchema, studentSchema}