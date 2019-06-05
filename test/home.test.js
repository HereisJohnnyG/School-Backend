//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongodb = require("mongodb");


let student = require('../routes/student');
let course = require('../routes/course');
let teacher = require('../routes/teacher');
let user = require('../routes/user');


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Books', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     student.remove({}, (err) => { 
    //        done();           
    //     });        
    // });
/*
  * Test the /GET route
  */
  describe('/GET user', () => {
      it('it should GET all the books', (done) => {
        chai.request(server)
            .get('/user')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
  });

});