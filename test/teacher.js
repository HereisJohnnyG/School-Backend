const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../index');

// describe('Unit testing the /api/v1/teacher route', function() {

//   describe('GET /api/v1/teacher', function() {

//     it('should return OK status', function() {
//       return request(app)
//         .get('/api/v1/teacher')
//         .then(function(res) {
//             assert.equal(res.status, 200)
//         });
//     });

//     it('should return an array', function() {
//       return request(app)
//         .get('/api/v1/teacher')
//         .then(function(res) {
//           assert.isArray(res.body);
//         });
//     });

//   });

//   describe('POST /api/v1/teacher', function() {

//     it("should NOT register a teacher if its phd is not true", function() {
//       return request(app)
//         .post('/api/v1/teacher')
//         .send({ name: "New Test Teacher", lastname: "01", phd: "something" })
//         .then(function(res) { 
//           assert.equal(res.status, 401);
//         });
//     });

//     it("should register a teacher if its phd is true", function() {
//       return request(app)
//         .post('/api/v1/teacher')
//         .send({ name: "New Test Teacher", lastname: "01", phd: true })
//         .then(function(res) { 
//           assert.equal(res.status, 201);
//         });
//     });

//   });

//   describe('PUT /api/v1/teacher/:id', function() {

//     it("should NOT update a teacher if its phd is not true", function() {
//       return request(app)
//         .put('/api/v1/teacher/1')
//         .send({ name: "Edited Test Teacher", lastname: "01", phd: "something" })
//         .then(function(res) { 
//           assert.equal(res.status, 401);
//         });
//     });

//     it("should update a teacher if its phd is true", function() {
//       return request(app)
//         .put('/api/v1/teacher/1')
//         .send({ name: "Edited Test Teacher", lastname: "01", phd: true })
//         .then(function(res) { 
//           assert.equal(res.status, 200);
//         });
//     });

//   });

// });