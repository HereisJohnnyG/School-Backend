const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../index');

describe('Test Unit for all PUT routes on /api/v1', function() {

    describe('PUT /api/v1/user/:id', function() {
        it("Do update a user if its profile = 'guess'", function() {
          return request(app)
            .put('/api/v1/user/1')
            .send({ name: "Jeff", lastname: "Doe", profile: "guess" })
            .then(function(res) { 
              assert.equal(res.status, 200);
            });
        });
    
        it("Do update a user if its profile = 'admin'", function() {
          return request(app)
            .put('/api/v1/user/1')
            .send({ name: "Jeff", lastname: "Doe", profile: "admin" })
            .then(function(res) { 
              assert.equal(res.status, 200);
            });
        });
    
        it("Don't update a user if its profile != 'guess' or 'admin'", function() {
          return request(app)
            .put('/api/v1/user/1')
            .send({ name: "Jeff", lastname: "Doe", profile: "annonymous" })
            .then(function(res) { 
              assert.equal(res.status, 401);
            });
        });
    
      });


      describe('PUT /api/v1/teacher/:id', function() {


        it("Do update a teacher if its phd = true", function() {
            return request(app)
              .put('/api/v1/teacher/1')
              .send({ name: "Jeff", lastname: "01", phd: true })
              .then(function(res) { 
                assert.equal(res.status, 200);
              });
          });
    
    
        it("Don't update a teacher if its phd != true", function() {
          return request(app)
            .put('/api/v1/teacher/1')
            .send({ name: "Jeff", lastname: "01", phd: "annonymous" })
            .then(function(res) {
              assert.equal(res.status, 401);
            });
        });
    
      });



      describe('PUT /api/v1/course/:id', function() {

        it("Do update a course if teacher >= 2", function() {
            return request(app)
              .put('/api/v1/course/1')
              .send({ name: "Course Sample", period: 2, city: "Ipatinga", teacher: [1, 2] })
              .then(function(res) { 
                assert.equal(res.status, 200);
              });
          });
    
        it("Don't update a course if teacher < 2", function() {
          return request(app)
            .put('/api/v1/course/1')
            .send({ name: "Course Sample", period: 2, city: "Ipatinga", teacher: [1, "invalid"] })
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



})
