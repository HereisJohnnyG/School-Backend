// const chai = require('chai');
// const assert = chai.assert;
// const request = require('supertest');

// const app = require('../index');

// describe('Test Unit for all POST routes on /api/v1', function() {

//   describe('POST /api/v1/user', function() {

//     it("Do save a new user on database if its profile = 'guess'", function() {
//       return request(app)
//         .post('/api/v1/user')
//         .send({ name: "John", lastname: "Doe", profile: "guess" })
//         .then(function(res) { 
//           assert.equal(res.status, 201);
//         });
//     });

//     it("Do save a new user on database if its profile = 'admin'", function() {
//       return request(app)
//         .post('/api/v1/user')
//         .send({ name: "John", lastname: "Doe", profile: "admin" })
//         .then(function(res) { 
//           assert.equal(res.status, 201);
//         });
//     });

//     it("Don't save a new user on database if its profile != 'guess' or 'admin'", function() {
//       return request(app)
//         .post('/api/v1/user')
//         .send({ name: "John", lastname: "Doe", profile: "annonymous" })
//         .then(function(res) { 
//           assert.equal(res.status, 401);
//         });
//     });
    
        
    
//   });

//   describe('POST /api/v1/teacher', function() {

//     it("Do save a new teacher on database if phd = true", function() {
//       return request(app)
//         .post('/api/v1/teacher')
//         .send({ name: "John", lastname: "Doe", phd: true })
//         .then(function(res) { 
//           assert.equal(res.status, 201);
//         });
//     });
  
//     it("Don't save a new teacher on database if phd != true", function() {
//       return request(app)
//         .post('/api/v1/teacher')
//         .send({ name: "John", lastname: "Doe", phd: false })
//         .then(function(res) { 
//           assert.equal(res.status, 401);
//         });
//     });
  
//   });

//   describe('POST /api/v1/course', function() {

//     before(done => {

//       request(app)
//         .post('/api/v1/teacher')
//         .send({ name: "John", lastname: "Doe", phd: true })
//         .then(res => {
//           done();
//         });

//     });
  
//       it("Do save a new course on database if teachers field recieve less than 2 valid teachers", function() {
//         return request(app)
//           .post('/api/v1/course')
//           .send({ name: "Course Exemple", period: 2, city: "Ipatinga", teacher: [1, 2] })
//           .then(function(res) { 
//             assert.equal(res.status, 201);
//           });
//       });

//       it("Don't save a new course on database if teachers field recieve less than 2 valid teachers", function() {
//         return request(app)
//           .post('/api/v1/course')
//           .send({ name: "Course Exemple", period: 2, city: "Ipatinga", teacher: [1, 'invalid'] })
//           .then(function(res) { 
//             assert.equal(res.status, 401);
//           });
//       });
  
//   });

//   describe('POST /api/v1/student', function() {


//     it("Do save a new student on database if age >= 17", function() {
//       return request(app)
//         .post('/api/v1/student')
//         .send({ name: "John", lastname: "Doe", age: 17, course: 1})
//         .then(function(res) { 
//           assert.equal(res.status, 201);
//         });
//     });

//     it("Don't save a new student on database if its age is less than 17", function() {
//       return request(app)
//         .post('/api/v1/student')
//         .send({ name: "John", lastname: "Doe", age: 16, course: 1})
//         .then(function(res) { 
//           assert.equal(res.status, 401);
//         });
//     });

//     it("Do save a new student if it has a valid course", function() {
//       return request(app)
//         .post('/api/v1/student')
//         .send({ name: "John", lastname: "Doe", age: 21, course: 1})
//         .then(function(res) { 
//           assert.equal(res.status, 201);
//         });
//     });
  
//     it("Don't save a new student if it has an invalid course", function() {
//       return request(app)
//         .post('/api/v1/student')
//         .send({ name: "John", lastname: "Doe", age: 21, course: 'invalid'})
//         .then(function(res) { 
//           assert.equal(res.status, 401);
//         });
//     });
  
//   });
// })
