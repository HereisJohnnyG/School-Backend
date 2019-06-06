let chai = require('chai');
var assert = chai.assert;
const request = require('supertest');
let server = require('../index');


describe('Unit testing the /api/v1 route', function() {

    this.timeout(12000);
  
    before(done => {
  
      setTimeout(() => {
        done();
      }, 10000);
  
    });
  
    it('GET /api/v1 should return OK status', function() {
      return request(server)
        .get('/api/v1')
        .then(function(res){
            assert.equal(res.status, 200)
        })
  });


  it('GET /api/v1 should return a hello world message', function() {
    return request(server)
      .get('/api/v1')
      .then(function(res){
        assert.match(res.text, /hello world/i);
      })
  });

});