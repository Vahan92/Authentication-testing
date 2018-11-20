import * as chai from 'chai';
import * as request from 'supertest';
import * as app from '../app';
import chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp)
describe('POST /reset', () => {
    it('it should return 403 Access denied with 205 status as header is not set.', (done) => {
        const credentials = {
            userName: 'scorpion_potter',
            oldPassword: 'hogwartS_45',
            newPassword: 'hogwartS_new_P(43'
        }
        request(app)
            .post('/auth/reset')
            .send(credentials)
            .expect(403, {
                "errors": [{ "message": 'Bad request. Set header to accept application/json', "code": 205 }]
            }, done);
    })
    it('it should return 400 Bad request with 203 status as new password is of wrong format', (done) => {
        const credentials = {
            userName: 'scorpion_potter',
            oldPassword: 'hogwartS_45',
            newPassword: 'hogwarts'
        }
        request(app)
            .post('/auth/reset')
            .set('Accept', 'application/json')
            .send(credentials)
            .expect(400, {
                "errors": [{ "message": "New password is of wrong format.", "code": 203 }]
            }, done);
    });

    it('it should return 400 bad request with 203 status and not reset user password as username does not exist', (done) => {
        const credentials = {
            userName: 'unknown',
            oldPassword: 'hogwartS_45',
            newPassword: 'hogwarts_89_S'
        }
        request(app)
            .post('/auth/reset')
            .set('Accept', 'application/json')
            .send(credentials)
            .expect(400, {"errors": [{
                "message": "Username does not exist.", "code": 203
            }]}, done);
    });

    it('it should return 400 Bad request with 203 status as it is identical to the old password', (done) => {
        const credentials = {
            userName: 'scorpion_potter',
            oldPassword: 'hogwartS_45',
            newPassword: 'hogwartS_45'
        }
        request(app)
            .post('/auth/reset')
            .set('Accept', 'application/json')
            .send(credentials)
            .expect(400, {
                "errors": [{ "message": "Your new password is identical to your old password", "code": 203 }]
            }, done);
    });

    it('it should return 200 OK with 100 status and reset user password', (done) => {
        const credentials = {
            userName: 'scorpion_potter',
            oldPassword: 'hogwartS_45',
            newPassword: 'hogwartS_new_P(43'
        }
        request(app)
            .post('/auth/reset')
            .set('Accept', 'application/json')
            .send(credentials)
            .expect(200, {
                message: "New password is set successfully.",
                code: 100
            }, done);
    })
});
