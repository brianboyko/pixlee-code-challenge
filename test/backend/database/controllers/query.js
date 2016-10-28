import _ from 'lodash';
import moment from 'moment';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import queryController from '../../../../src/backend/database/controllers/query.js';
import knex from '../../../../src/backend/database/db';

const { startQuery } = queryController(knex);

chai.use(chaiAsPromised);
const expect = chai.expect;

let fakeRes = {
  send: sinon.spy(),
};

describe('/src/backend/database/controllers/query.js', function(){
  describe('startQuery', function(){
    it('correctly starts a query', function(done){
      this.timeout(15000);
      expect(startQuery(
        "dogs",
        { startDate: moment().subtract(15, 'minutes').unix(), endDate: moment().unix() },
        'brian.boyko@gmail.com',
        fakeRes)
        .then((resp) => ({
          confirmationEmailOkay: _.includes(resp.confirmationEmailInfo.response, '250 2.0.0 OK'),
          resultsEmailOkay: _.includes(resp.resultsEmailInfo.response, '250 2.0.0 OK'),
          mediaIdsAreNumbers: resp.mediaIds.reduce((pv, cv) => pv && !Number.isNaN(cv), true),
          queryIdIsNumber: !Number.isNaN(resp.queryId),
        })))
        .to.eventually.eql({
          confirmationEmailOkay: true,
          resultsEmailOkay: true,
          mediaIdsAreNumbers: true,
          queryIdIsNumber: true,
        }).notify(done);
    });
    it('should have sent data back to the frontend during that last test', function(){
      console.log("fakeRes.args");
      let resArgs = {
        email: fakeRes.send.args[0][0].email,
        idIsNaN: Number.isNaN(fakeRes.send.args[0][0].id),
        placementIsNaN: Number.isNaN(fakeRes.send.args[0][0].placement),
      };
      expect(resArgs).to.eql({
        email: 'brian.boyko@gmail.com',
        idIsNaN: false,
        placementIsNaN: false,
      });
    });
  });
});
