const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../index');

describe('Test Unit on /api/v1/teacher route', function() {

  describe('GET /api/v1/teacher', function() {

    it('Do check if GET is responding', function() {
      return request(app)
        .get('/api/v1/teacher')
        .then(function(res) {
            assert.equal(res.status, 200)
        });
    });

    it('Do check if return an array', function() {
      return request(app)
        .get('/api/v1/teacher')
        .then(function(res) {
          assert.isArray(res.body);
        });
    });

  });

  describe('POST /api/v1/teacher', function() {

    it("Do save a new teacher on database if phd = true", function() {
      return request(app)
        .post('/api/v1/teacher')
        .send({ name: "John", lastname: "Doe", phd: true })
        .then(function(res) { 
          assert.equal(res.status, 201);
        });
    });
  
    it("Don't save a new teacher on database if phd != true", function() {
      return request(app)
        .post('/api/v1/teacher')
        .send({ name: "John", lastname: "Doe", phd: false })
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


  describe('DELETE /api/v1/teacher/:id', function() {
    it("Do delete a teacher", function() {
      return request(app)
        .delete('/api/v1/teacher/5')
        .then(function(res) {
            assert.equal(res.status, 200)
        });
    })

    it("Don't delete a user", function() {
      return request(app)
        .delete('/api/v1/teacher/5')
        .then(function(res) {
            assert.equal(res.status, 204)
        });
    })
  })


});