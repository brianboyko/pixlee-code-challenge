import _ from 'lodash';
import moment from 'moment';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import knex from '../../../../src/backend/database/db';

import Queries from '../../../../src/backend/database/models/Queries';
import Tags from '../../../../src/backend/database/models/Tags';

const queries = Queries(knex);
const tags = Tags(knex);

describe('./src/backend/database/models/Queries.js', function(){
  describe('queries.create()', function(){
    before(function(done) {
      knex.raw('truncate table ' + 'queries' + ' cascade').then(() => done());
    });

    var test_id;
    it('creates a query record', function(done){
      expect(queries.create("StephenFry", { startDate: 1477181705, endDate: 1477181800 }, 'stephen@fry.com')
      .then((idResponse) => {
        test_id = idResponse[0];
        return idResponse[0];
      })).to.eventually.be.a('Number').notify(done);
    });

    it('retrives a query record (part 1)', function(done) {
      expect(queries.read.byId(test_id)
        .then((qRecord) => qRecord[0].tag_id)
        .then((qTagId) => tags.read.byId(qTagId))
        .then((tTagRecord) => tTagRecord[0].tag_name))
        .to.eventually.equal("StephenFry").notify(done);
    });

    it('retrives a query record (part 2)', function(done) {
      expect(queries.read.byId(test_id)
        .then((qRecord) => Promise.all([
          _.pick(qRecord[0], ['tag_name', 'user_email', 'earliest_date', 'latest_date', 'completed']),
          tags.read.byId(qRecord[0].tag_id).then((tagRecord) => tagRecord[0].tag_name),
        ])
        .then((objs) => Object.assign(objs[0], { tag_name: objs[1] }))))
        .to.eventually.eql({
          tag_name: 'StephenFry',
          user_email: 'stephen@fry.com',
          completed: false,
          earliest_date: moment.unix(1477181705).toDate(),
          latest_date: moment.unix(1477181800).toDate(),
        }).notify(done);
    });

    it('can complete a query', function(done) {
      expect(queries.complete(test_id)
        .then(() => queries.read.byId(test_id))
        .then((records) => _.pick(records[0], 'completed', 'earliest_date', 'latest_date')))
        .to.eventually.eql({
          completed: true,
          earliest_date: moment.unix(1477181705).toDate(),
          latest_date: moment.unix(1477181800).toDate(),
        }).notify(done);
    });

    var sandis_id;
    it('can retrieve queries by tagName', function(done) {
      expect(queries.create("SandiToksvig", { startDate: 1477181705, endDate: 1477181800 }, 'sandi@qi.com')
        .then((idResponse) => {
          sandis_id = idResponse[0];
          return queries.read.byTagName("SandiToksvig");
        }).then((resp) => resp.id))
        .to.eventually.equal(sandis_id).notify(done);
    });
  });
});
