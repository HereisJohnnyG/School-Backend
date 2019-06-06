// const chai = require('chai');
// const assert = chai.assert;
// const request = require('supertest');

// const app = require('../index');

// describe('Unit testing the /api/v1/user route', function() {

//   describe('GET /api/v1/user', function() {

//     it('should return OK status', function() {
//       return request(app)
//         .get('/api/v1/user')
//         .then(function(res) {
//             assert.equal(res.status, 200)
//         });
//     });

//     it('should return an array', function() {
//       return request(app)
//         .get('/api/v1/user')
//         .then(function(res) {
//           assert.isArray(res.body);
//         });
//     });

//   });

//   describe('POST /api/v1/user', function() {

//     it("should NOT register a user if its profile is different then 'guess' or 'admin'", function() {
//       return request(app)
//         .post('/api/v1/user')
//         .send({ name: "New Test User", lastname: "01", profile: "something" })
//         .then(function(res) { 
//           assert.equal(res.status, 401);
//         });
//     });

//     it("should register a user if its profile is 'guess'", function() {
//       return request(app)
//         .post('/api/v1/user')
//         .send({ "name": "New Test User", "lastname": "01", "profile": "guess" })
//         .then(function(res) { 
//           assert.equal(res.status, 201);
//         });
//     });

//     it("should register a user if its profile is 'admin'", function() {
//       return request(app)
//         .post('/api/v1/user')
//         .send({ name: "New Test User", lastname: "01", profile: "admin" })
//         .then(function(res) { 
//           assert.equal(res.status, 201);
//         });
//     });

//   });

//   describe('PUT /api/v1/user/:id', function() {

//     it("should NOT update a user if its profile is different then 'guess' or 'admin'", function() {
//       return request(app)
//         .put('/api/v1/user/1')
//         .send({ name: "Edited Test User", lastname: "01", profile: "something" })
//         .then(function(res) { 
//           assert.equal(res.status, 401);
//         });
//     });

//     it("should update a user if its profile is 'guess'", function() {
//       return request(app)
//         .put('/api/v1/user/1')
//         .send({ name: "Edited Test User", lastname: "01", profile: "guess" })
//         .then(function(res) { 
//           assert.equal(res.status, 200);
//         });
//     });

//     it("should update a user if its profile is 'admin'", function() {
//       return request(app)
//         .put('/api/v1/user/1')
//         .send({ name: "Edited Test User", lastname: "01", profile: "admin" })
//         .then(function(res) { 
//           assert.equal(res.status, 200);
//         });
//     });

//   });

// });