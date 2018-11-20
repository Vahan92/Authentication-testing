import * as chai from 'chai';
import * as request from 'supertest';
import * as app from '../app';
import * as chaiHttp from'chai-http';
const expect = chai.expect;

chai.use(chaiHttp);

describe('POST /login', () => {

    it('it should return 403 Access denied with 205 status code as header is not set', (done) => {
        const user = {
            userName: 'scorpion_potter',
            password: 'hogwartS_13'
        }
        request(app)
            .post('/auth/login')
            .send(user)
            .expect(403, {
                "errors": [{ "message": 'Bad request. Set header to accept application/json', "code": 205 }]
            }, done);
    });

    it('it should return 400 Bad request with 203 status code as password is missing', (done) => {
        const user = {
            userName: 'unavailable'
        }
        request(app)
            .post('/auth/login')
            .set({'Accept': 'application/json'})
           .send(user)
           .expect(400, {
            "errors": [{ "message": 'Password is required', "code": 203 }]
        }, done);
 
    });

    it('it should return 400 Bad request with 203 status code as username is missing', (done) => {
        const user = {
            password: 'hogwartS_45',
        }
        request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send(user)
            .expect(400, {
                "errors": [{ "message": 'Username is required', "code": 203 }]
            }, done);
    });

    it('it should return 403 Access denied with 205 status because of incorrect username or password', (done) => {
        const user = {
            userName: 'unavailable',
            password: 'hogwartS_45'
        }
        request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send(user)
            .expect(403, {
                "errors": [{ "message": 'Username or password is incorrect', "code": 205 }]
            }, done);
    });

    it('it should return 200 OK and login succesfully', (done) => {
        const user = {
            userName: 'scorpion_potter',
            password: 'hogwartS_45'
        }
        request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send(user)
            .expect(200, done)
    });

    it('it should return JWT token if good username or password', (done) => {
        const user = {
            userName: 'scorpion_potter',
            password: 'hogwartS_45'
        }
        request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send(user)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).have.property('jwt');
                done();
            });
    });
});