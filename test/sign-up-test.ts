import * as chai from 'chai'
import * as request from 'supertest';
import * as app from '../app';
import chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const User = require('../models/user-model');
User.deleteMany({}, () => {
})

describe('POST /sign-up', () => {
    it('it should return 403 Access denied with 205 status as header is not set.', (done) => {
        const user = {
            userName: 'scorpion_potter', 
            password: 'hogwartS_13',
            email: 'albus.dombulder1@hogwarts.edu'
        }
        request(app)
            .post('/auth/sign-up')
            .send(user)
            .expect(403, { "errors": [{"message" : 'Bad request. Set header to accept application/json', "code" : 205}] 
        }, done);
    });


    it('it should return 400 Bad request with 203 status because username is not specified', (done) => {
        const user = {
            password: 'hogwarts',
            email: 'albus.dombulder1@hogwarts.edu'
        }
        request(app)
            .post('/auth/sign-up')
            .set('Accept', 'application/json')
            .send(user)
            .expect(400, { "errors": [{"message" : 'Username is not specified', "code" : 203}] 
        }, done);
    });

    it('it should return 400 Bad request with 203 status because password is not specified', (done) => {
        const user = {
            userName: 'scorpion_potter',
            email: 'albus.dombulder1@hogwarts.edu'       
        }
        request(app)
            .post('/auth/sign-up')
            .set('Accept', 'application/json')
            .send(user)
            .expect(400, { "errors": [{"message" : 'Password is not specified', "code" : 203}] 
        }, done);
    });

    it('it should return 400 Bad request with 203 status because email is not specified', (done) => {
        const user = {
            userName: 'scorpion_potter',
            password: 'hogwartS_17'
        }
        request(app)
            .post('/auth/sign-up')
            .set('Accept', 'application/json')
            .send(user)
            .expect(400, { "errors": [{"message" : 'Email is not specified', "code" : 203}]
        }, done);
    });

    it('it should return 400 Bad request with 203 status because password is of wrong format', (done) => {
        const user = {
            userName: 'scorpion_potter',
            password: 'hogwarts',
            email: 'albus.dombulder1@hogwarts.edu'
        }
        request(app)
            .post('/auth/sign-up')
            .set('Accept', 'application/json')
            .send(user)
            .expect(400, { "errors": [{"message" : 'Password should contain at least 8 characters, at least one uppercase letter, at least one lowercase letter, at least one special character', "code" : 203}] 
        }, done);
    });

    it('it should return 400 Bad request with 203 status because username is less than 6 characters', (done) => {
        const user = {
            userName: 'scorp',
            password: 'hogwartS_17',
            email: 'albus.dombulder1@hogwarts.edu'
        }
        request(app)
            .post('/auth/sign-up')
            .set('Accept', 'application/json')
            .send(user)
            .expect(400, { "errors": [{"message" : 'Username should contain at least 6 characters', "code" : 203}] 
        }, done);
    });

    it('it should return 200 OK with 100 status and register new user', (done) => {
        const user = {
            userName: 'scorpion_potter',
            password: 'hogwartS_45',
            email: 'albus.dombulder1@hogwarts.edu'
        }
        request(app)
            .post('/auth/sign-up')
            .set('Accept', 'application/json')
            .send(user)
            .expect(200, {
                message: 'Registration is successful!',
                code: 100
            }, done);
    });

    it('it should return 400 Bad request with 203 status as username already exists', (done) => {
        const user = {
            userName: 'scorpion_potter',
            password: 'asdfhh_HHH_45',
            email: 'albus@hogwarts.edu'
        }
        request(app)
            .post('/auth/sign-up')
            .set('Accept', 'application/json')
            .send(user)
            .expect(400, { "errors": [{"message" : 'Username already exists!', "code" : 203}] }, done);
    });
    it('it should return 400 Bad request with 203 status as email is already in use', (done) => {
        const user = {
            userName: 'scorpion_potter_465',
            email: 'albus.dombulder1@hogwarts.edu',
            password: 'asdfhh_HHH_45'
        }
        request(app)
            .post('/auth/sign-up')
            .send(user)
            .set('Accept', 'application/json')
            .expect(400, { "errors": [{"message" : 'Email is already in use', "code" : 203}] }, done);
    });
});
