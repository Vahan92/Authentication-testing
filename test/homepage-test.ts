import * as chai from 'chai';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import * as chaiHttp from 'chai-http';
import * as app from '../app';
import * as config from '../config/keys';
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /homepage', () => {
    let token;
    before(function (done) {
        token = jwt.sign({
            id: 1,
        }, config.JWT_SECRET, { expiresIn: 60 });
        done();
    });


    it('it should return 403 Access denied with 203 status as header is not set.', (done) => {
        request(app)
            .get('/auth/homepage')
            .expect(403, {
                "errors": [{ "message": 'Bad request. Set header to accept application/json', "code": 205 }]
            }, done);
    });

    it('it should return 200 OK with 100 status and return current user data', (done) => {
        request(app)
            .get('/auth/homepage')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(200, {
                message: "User is logged in succesfully",
                code: 100
            }, done);
    });

    it('it should return 403 Access denied with 205 status because token is not passed', (done) => {
        request(app)
            .get('/auth/homepage')
            .set('Accept', 'application/json')
            .expect(403, {
                "errors": [{ "message": 'Token is not set', "code": 205 }]
            }, done);
    });
});
