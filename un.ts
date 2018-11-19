import { expect } from 'chai';
import chai = require('chai');
import ChaiHttp = require('chai-http');
import 'mocha';

import { app } from '../app';

chai.use(ChaiHttp);

describe('API endpoint /reports', function () {

  const baseUrl = '/api/v2';
  const botId = '/-LCXsEQbdQOrou7fD3GF';
  const botInvalidId = '/Z1B2';

  // General
  const report = '/report';
  const reports = '/reports';
  const summeryReport = '/summeryReport'


  const reportObj = {
    "bot_id": "-LBzTAUEPHfP6t5cLhJy",
    "user_id": "ClUxCZaBYESlCwG22GT0fHTFasm1",
    "report_id": "bbbb76e0-58da-11e8-9725-eb5a702fd2cf",
    "total_message_count": 1,
    "params": {
      "key1": "value1",
      "key2": "value2"
    }
  }

  const reportObjUserIdMiss = {
    "bot_id": "-LBzTAUEPHfP6t5cLhJy",
    "report_id": "bbbb76e0-58da-11e8-9725-eb5a702fd2cf",
    "total_message_count": 1,
    "params": {
      "key1": "value1",
      "key2": "value2"
    }
  }

  const reportObjBotIdMiss = {
    "user_id": "ClUxCZaBYESlCwG22GT0fHTFasm1",
    "report_id": "bbbb76e0-58da-11e8-9725-eb5a702fd2cf",
    "total_message_count": 1,
    "params": {
      "key1": "value1",
      "key2": "value2"
    }
  }

  const reportObjBotIdUserIdMiss = {
    "report_id": "bbbb76e0-58da-11e8-9725-eb5a702fd2cf",
    "total_message_count": 1,
    "params": {
      "key1": "value1",
      "key2": "value2"
    }
  }

  const reportObjReportIdMiss = {
    "bot_id": "-LBzTAUEPHfP6t5cLhJy",
    "user_id": "ClUxCZaBYESlCwG22GT0fHTFasm1",
    "total_message_count": 1,
    "params": {
      "key1": "value1",
      "key2": "value2"
    }
  }

  const reportObjParamsMiss = {
    "bot_id": "-LBzTAUEPHfP6t5cLhJy",
    "user_id": "ClUxCZaBYESlCwG22GT0fHTFasm1",
    "report_id": "bbbb76e0-58da-11e8-9725-eb5a702fd2cf",
    "total_message_count": 1,
  }

  const expectedSummeryReport = {
    'last7Days': '',
    'lastMonth': '',
    'sessionCount': '',
  }

  describe('GET /reports/:id', function () {

    it('should return an error as bot id is missing in the request path', function () {
      return chai.request(app)
        .get(baseUrl + reports + '?start=0&size=20')
        .set('Content-type', 'application/json')
        .then(function (res) {
          expect(res).to.have.status(404);
          expect(res).to.be.html;
        });
    });

    it('should return an error as invalid bot id is provided', function () {
      return chai.request(app)
        .get(baseUrl + reports + botInvalidId + '?start=0&size=20')
        .set('Content-type', 'application/json')
        .then(function (res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
        });
    });

    it('should return available reports from 1st to 30th as 1st is default index if start is not provided', function () {
      return chai.request(app)
        .get(baseUrl + reports + botId + '?size=20')
        .set('Content-type', 'application/json')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
        });
    });

    it('should return available reports from 5th to 25th as 20 is default count if size is not provided', function () {
      return chai.request(app)
        .get(baseUrl + reports + botId + '?start=0')
        .set('Content-type', 'application/json')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
        });
    });

    it('should return available reports from 1st to 20th', function () {
      return chai.request(app)
        .get(baseUrl + reports + botId)
        .set('Content-type', 'application/json')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
        });
    });

    it('should return available reports from 10th to 50th', function () {
      return chai.request(app)
        .get(baseUrl + reports + botId + '?start=0&size=20')
        .set('Content-type', 'application/json')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
        });
    });
  });

  describe('POST /report', function () {

    it('should return an error as bot id is missing in the request body', function () {
      return chai.request(app)
        .post(baseUrl + report)
        .set('Content-type', 'application/json')
        .send(reportObjBotIdMiss)
        .then(function (res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
        });
    });

    it('should return an error as user id is missing in the request body', function () {
      return chai.request(app)
        .post(baseUrl + report)
        .set('Content-type', 'application/json')
        .send(reportObjUserIdMiss)
        .then(function (res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
        });
    });

    it('should return error as both bot id and user id are missing in the request body', function () {
      return chai.request(app)
        .post(baseUrl + report)
        .set('Content-type', 'application/json')
        .send(reportObjBotIdUserIdMiss)
        .then(function (res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
        });
    });

    it('should return error response as params is missing', function () {
      return chai.request(app)
        .post(baseUrl + report)
        .set('Content-type', 'application/json')
        .send(reportObjParamsMiss)
        .then(function (res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
        });
    });

    it('should return error response as request body is missing', function () {
      return chai.request(app)
        .post(baseUrl + report)
        .set('Content-type', 'application/json')
        .then(function (res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
        });
    });

    it('should return success response as all required properties are provided', function () {
      return chai.request(app)
        .post(baseUrl + report)
        .set('Content-type', 'application/json')
        .send(reportObjReportIdMiss)
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
        });
    });

    it('should return reports list as a response body', function () {
      return chai.request(app)
        .post(baseUrl + report)
        .set('Content-type', 'application/json')
        .send(reportObj)
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
        });
    });
  });

  describe('GET /summeryReport', function () {

    it('should return an error as user id is missing in the request', function () {
      return chai.request(app)
        .get(baseUrl + summeryReport)
        .set('Content-type', 'application/json')
        .then(function (res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
        });
    });

    it('should return success response', function () {
      return chai.request(app)
        .get(baseUrl + summeryReport + '?userId=ClUxCZaBYESlCwG22GT0fHTFasm1')
        .set('Content-type', 'application/json')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.all.keys(expectedSummeryReport)
        });
    });
  });

});
