import * as chai from 'chai';
import * as request from 'supertest';
import * as app from '../app';
import chaiHttp = require('chai-http');
import * as jwt from 'jsonwebtoken';
const config = require('../config/keys');

chai.use(chaiHttp);

describe('POST /logout', () => {
    let token;
    before(function (done) {
        token = jwt.sign({
            id: 1,
        }, config.JWT_SECRET, { expiresIn: 60 * 60 * 60 });
        done();
    });

    it('it should return 403 Access denied with 205 status as header is not set.', (done) => {
        request(app)
            .post('/auth/logout')
            .set('auth-key', token)
            .expect(403, {
                "errors": [{ "message": 'Bad request. Set header to accept application/json', "code": 205 }]
            }, done);
    });

    it('it should return 302 Found with 103 status and should log out user', (done) => {
        request(app)
            .post('/auth/logout')
            .set('Accept', 'application/json')
            .set('auth-key', token)
            .expect('Location', '/login')
            .expect(302, done);
    });

    it('it should return 400 Bad request with 203 status because token has expired', (done) => {
        // token that expires immediately
        const token = jwt.sign({
            id: 1,
        }, config.JWT_SECRET, { expiresIn: 1 });
        setTimeout(function () {
            request(app)
                .post('/auth/logout')
                .set('Accept', 'application/json')
                .set('auth-key', token)
                .expect(400, {
                    "errors": [{ "message": "Invalid authorization token provided", "code": 203 }]
                }, done);
        }, 1500);
    });
});