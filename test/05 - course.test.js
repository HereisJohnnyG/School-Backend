const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../index');

describe('Test Unit on /api/v1/course route', function() {

  describe('GET /api/v1/course', function() {

    it('Do check if GET is responding', function() {
      return request(app)
        .get('/api/v1/course')
        .then(function(res) {
            assert.equal(res.status, 200)
        });
    });

    it('Do check if return an array', function() {
      return request(app)
        .get('/api/v1/course')
        .then(function(res) {
          assert.isArray(res.body);
        });
    });

  });

  describe('GET /api/v1/course/:id', function() {

    it('Do check if GET/:id is responding', function() {
      return request(app)
        .get('/api/v1/course/1')
        .then(function(res) {
            assert.equal(res.status, 200)
        });
    });

    it('Do check empty array returns 204', function() {
      return request(app)
        .get('/api/v1/teacher/1000')
        .then(function(res) {
          assert.equal(res.status, 204)
        });
    });
    
  });



  describe('POST /api/v1/course', function() {

    before(done => {

      request(app)
        .post('/api/v1/teacher')
        .send({ name: "John", lastname: "Doe", phd: true })
        .then(res => {
          done();
        });

    });
  
      it("Do save a new course on database if teachers field recieve less than 2 valid teachers", function() {
        return request(app)
          .post('/api/v1/course')
          .send({ name: "Course Exemple", period: 2, city: "Ipatinga", teacher: [1, 2] })
          .then(function(res) { 
            assert.equal(res.status, 201);
          });
      });

      it("Don't save a new course on database if teachers field recieve less than 2 valid teachers", function() {
        return request(app)
          .post('/api/v1/course')
          .send({ name: "Course Exemple", period: 2, city: "Ipatinga", teacher: [1, 'invalid'] })
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


  describe('DELETE /api/v1/course/:id', function() {
    it("Do delete a course", function() {
      return request(app)
        .delete('/api/v1/course/5000')
        .then(function(res) {
            assert.equal(res.status, 200)
        });
    })

    it("Don't delete a course", function() {
      return request(app)
        .delete('/api/v1/course/6000')
        .then(function(res) {
            assert.equal(res.status, 204)
        });
    })
  })




});