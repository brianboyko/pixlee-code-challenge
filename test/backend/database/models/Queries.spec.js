import _ from 'lodash';
import moment from 'moment';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import knex from '../setup';
import Queries from '../../../../src/backend/database/models/Queries';
import Tags from '../../../../src/backend/database/models/Tags';

const queries = Queries(knex);
const tags = Tags(knex);

describe('./src/backend/database/models/Queries.js', function(){
  describe('queries.create()', function(){
    before(function(done) {
      knex.raw('truncate table ' + 'queries' + ' cascade').then(() => {
        console.log("clearing ig_users data")
        done()
      });
    })
    var test_id;
    it('creates a query record', function(done){
      expect(queries.create("StephenFry", 1477181705, 1477181800)
      .then((idResponse) => {
        console.log("idResponse", idResponse);
        test_id = idResponse[0];
        return idResponse[0];
      })).to.eventually.be.a('Number').notify(done);
    })
    it('retrives a query record (part 1)', function(done) {
      expect(queries.read.byId(test_id)
        .then((qRecord) => qRecord[0].tag_id)
        .then((qTagId) => tags.read.byId(qTagId))
        .then((tTagRecord) => tTagRecord[0].tag_name))
        .to.eventually.equal("StephenFry").notify(done);
    })
    it('retrives a query record (part 2)', function(done) {
      expect(queries.read.byId(test_id)
        .then((qRecord) => _.pick(qRecord[0], ['earliest_date', 'latest_date', 'completed'])))
        .to.eventually.eql({
          completed: false,
          earliest_date: moment.unix(1477181705).toDate(),
          latest_date: moment.unix(1477181800).toDate(),
        }).notify(done);
    })
    it('can complete a query', function(done) {
      expect(queries.complete(test_id)
        .then(() => queries.read.byId(test_id))
        .then((records) => _.pick(records[0], 'completed', 'earliest_date', 'latest_date')))
        .to.eventually.eql({
          completed: true,
          earliest_date: moment.unix(1477181705).toDate(),
          latest_date: moment.unix(1477181800).toDate(),
        }).notify(done);
    })
  })
})
