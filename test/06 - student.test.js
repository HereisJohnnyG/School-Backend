const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../index');

describe('Test Unit on /api/v1/student route', function() {

  describe('GET /api/v1/student', function() {

    it('Do check if GET is responding', function() {
      return request(app)
        .get('/api/v1/student')
        .then(function(res) {
            assert.equal(res.status, 200)
        });
    });

    it('Do check if return an array', function() {
      return request(app)
        .get('/api/v1/student')
        .then(function(res) {
          assert.isArray(res.body);
        });
    });

  });


  describe('POST /api/v1/student', function() {


    it("Do save a new student on database if age >= 17", function() {
      return request(app)
        .post('/api/v1/student')
        .send({ name: "John", lastname: "Doe", age: 17, course: 1})
        .then(function(res) { 
          assert.equal(res.status, 201);
        });
    });

    it("Don't save a new student on database if its age is less than 17", function() {
      return request(app)
        .post('/api/v1/student')
        .send({ name: "John", lastname: "Doe", age: 16, course: 1})
        .then(function(res) { 
          assert.equal(res.status, 401);
        });
    });

    it("Do save a new student if it has a valid course", function() {
      return request(app)
        .post('/api/v1/student')
        .send({ name: "John", lastname: "Doe", age: 21, course: 1})
        .then(function(res) { 
          assert.equal(res.status, 201);
        });
    });
  
    it("Don't save a new student if it has an invalid course", function() {
      return request(app)
        .post('/api/v1/student')
        .send({ name: "John", lastname: "Doe", age: 21, course: 'invalid'})
        .then(function(res) { 
          assert.equal(res.status, 401);
        });
    });
  
  });

  describe('PUT /api/v1/student/:id', function() {

    it("Don't update a student if its age is less than 17", function() {
      return request(app)
        .put('/api/v1/student/1')
        .send({ name: "Johnny", lastname: "Doe", age: 16, course: 1})
        .then(function(res) { 
          assert.equal(res.status, 401);
        });
    });

    it("Do update a student if its age is at least 17", function() {
      return request(app)
        .put('/api/v1/student/1')
        .send({ name: "Johnny", lastname: "Doe", age: 17, course: 1})
        .then(function(res) { 
          assert.equal(res.status, 200);
        });
    });

    it("Don't update a student if it has an invalid course", function() {
      return request(app)
        .put('/api/v1/student/1')
        .send({ name: "Johnny", lastname: "01", age: 21, course: 'invalid'})
        .then(function(res) { 
          assert.equal(res.status, 401);
        });
    });

    it("Do update a student if it has a valid course", function() {
      return request(app)
        .put('/api/v1/student/1')
        .send({ name: "Johnny", lastname: "01", age: 21, course: 1})
        .then(function(res) { 
          assert.equal(res.status, 200);
        });
    });

  });


  describe('DELETE /api/v1/student/:id', function() {
    it("Do delete a student", function() {
      return request(app)
        .delete('/api/v1/student/5000')
        .then(function(res) {
            assert.equal(res.status, 200)
        });
    })

    it("Don't delete a student", function() {
      return request(app)
        .delete('/api/v1/student/6000')
        .then(function(res) {
            assert.equal(res.status, 204)
        });
    })
  })

});