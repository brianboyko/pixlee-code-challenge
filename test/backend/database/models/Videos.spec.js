import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import knex from '../../../../src/backend/database/db';

import sampleRecord from '../../sampleRecord';
import Videos from '../../../../src/backend/database/models/Videos';
const videos = Videos(knex);

describe('./src/backend/database/models/Videos.js', function() {

  describe('create and read', function() {
    var test_ID;

    it('creates a record', function(done) {
      this.timeout(4000);
      expect(videos.create({
        low_resolution:{
          url: "foo",
        },
        standard_resolution:{
          url: "bar",
        },
        low_bandwidth: {
          url: "baz",
        }
      })
        .then((id) => {
          test_ID = id[0];
          return Number.isInteger(id[0]);
        }))
        .to.eventually.equal(true)
        .notify(done);
    });

    it('reads a record it creates', function(done) {
      this.timeout(4000);
      expect(videos.read.byId(test_ID)
        .then((records) => _.omit(records[0], ('id'))))
        .to.eventually.eql({
          low_res: "foo",
          standard_res: "bar",
          low_band: "baz",
        })
        .notify(done);
    });

  });

});
