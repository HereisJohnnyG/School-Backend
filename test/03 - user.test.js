const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../index');

describe('Test Unit on /api/v1/user route', function() {

  describe('GET /api/v1/user', function() {

    it('Do check if GET is responding', function() {
      return request(app)
        .get('/api/v1/user')
        .then(function(res) {
            assert.equal(res.status, 200)
        });
    });

    it('Do check if return an array', function() {
      return request(app)
        .get('/api/v1/user')
        .then(function(res) {
          assert.isArray(res.body);
        });
    });

  });

  describe('POST /api/v1/user', function() {

    it("Don't save a user on database if profile != 'guess' or 'admin'", function() {
      return request(app)
        .post('/api/v1/user')
        .send({ name: "John", lastname: "Doe", profile: "annonymous" })
        .then(function(res) { 
          assert.equal(res.status, 401);
        });
    });

    it("Do save a user on database if profile != 'guess'", function() {
      return request(app)
        .post('/api/v1/user')
        .send({ "name": "John", "lastname": "Doe", "profile": "guess" })
        .then(function(res) { 
          assert.equal(res.status, 201);
        });
    });

    it("Do save a user on database if profile != 'admin'", function() {
      return request(app)
        .post('/api/v1/user')
        .send({ name: "John", lastname: "Doe", profile: "admin" })
        .then(function(res) { 
          assert.equal(res.status, 201);
        });
    });

  });

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


  describe('DELETE /api/v1/user/:id', function() {
    it("Do delete a user", function() {
      return request(app)
        .delete('/api/v1/user/5000')
        .then(function(res) {
            assert.equal(res.status, 200)
        });
    })

    it("Don't delete a user", function() {
      return request(app)
        .delete('/api/v1/user/6000')
        .then(function(res) {
            assert.equal(res.status, 204)
        });
    })
  })

  


});