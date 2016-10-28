import _ from 'lodash';
import moment from 'moment';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import queryController from '../../../../src/backend/database/controllers/query.js';
import knex from '../../../../src/backend/database/db';

const { startQuery, retrieveQuery } = queryController(knex);

chai.use(chaiAsPromised);
const expect = chai.expect;


describe('/src/backend/database/controllers/query.js', function(){
  describe('startQuery', function(){
    let myQuery;
    let spy = sinon.spy();
    let spy2 = sinon.spy();
    it('correctly starts a query', function(done){
      this.timeout(30000);
      expect(startQuery(
        "dogs",
        { startDate: moment().subtract(15, 'minutes').unix(), endDate: moment().unix() },
        'brian.boyko@gmail.com',
        { send: spy })
        .then((resp) => {
          myQuery = resp.queryId;

          return {
            confirmationEmailOkay: _.includes(resp.confirmationEmailInfo.response, '250 2.0.0 OK'),
            resultsEmailOkay: _.includes(resp.resultsEmailInfo.response, '250 2.0.0 OK'),
            mediaIdsAreNumbers: resp.mediaIds.reduce((pv, cv) => pv && !Number.isNaN(cv), true),
            queryIdIsNumber: !Number.isNaN(resp.queryId),
          };
        }))
        .to.eventually.eql({
          confirmationEmailOkay: true,
          resultsEmailOkay: true,
          mediaIdsAreNumbers: true,
          queryIdIsNumber: true,
        }).notify(done);
    });
    it('should have sent data back to the frontend during that last test', function(){
      let resArgs = {
        email: spy.args[0][0].email,
        idIsNaN: Number.isNaN(spy.args[0][0].id),
        placementIsNaN: Number.isNaN(spy.args[0][0].placement),
      };
      expect(resArgs).to.eql({
        email: 'brian.boyko@gmail.com',
        idIsNaN: false,
        placementIsNaN: false,
      });
    });
    it('correctly sends info back to the frontend for display from a query id', function(done){
      this.timeout(4000);
      expect(retrieveQuery(myQuery, { send: spy2 })
        .then((result) => spy2.args[0][0] === result))
        .to.eventually.equal(true).notify(done);
    });
    it('has the correct info', function(done){
      this.timeout(4000);
      expect(retrieveQuery(myQuery, { send: (f) => f })
        .then((results) => results.reduce((pv, result) => pv &&
            result.hasOwnProperty('images') &&
            result.hasOwnProperty('media') &&
            result.hasOwnProperty('user')
          , true)))
        .to.eventually.equal(true).notify(done);
    });
  });
});
