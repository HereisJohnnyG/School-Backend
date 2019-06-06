let chai = require('chai');
var assert = require('chai').assert;
let chaiHttp = require('chai-http');
let user = require('../routes/user');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Users', () => {

/*
  * Test the /GET route
  */
    it('Create User Testing', (done) => {
        let user = {
            'name': 'Jeff',
            'lastname': 'Gandra',
            'profile': 'admin',
            'status': 1
        }
        chai.request(process.env.NODE_ENV)
            .post('/user')
            .send(user)
            .end((res) => {
                chai.expect(res.status).equal(200);
                done();
            });
        });
});
