import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import knex from '../../../../src/backend/database/db';

import Tags from '../../../../src/backend/database/models/Tags';

const tags = Tags(knex);

describe('./src/backend/database/models/Tags.js', function() {
  describe('create and read', function() {
    var test_ID;
    it('getOrAdd() creates a new record', function(done) {
      this.timeout(4000);
      expect(tags.getOrAdd("yolo")
        .then((response) => {
          test_ID = response.id;
          return Number.isInteger(response.id);
        }))
        .to.eventually.equal(true)
        .notify(done);
    });
    it("getOrAdd() makes a different record given a different input", function(done){
      this.timeout(4000);
      expect(tags.getOrAdd("notYolo").then((record) => record.id)).to.eventually.not.eql(test_ID).notify(done);
    })
    it('getOrAdd() retrieves the same record given the same input', function(done){
      this.timeout(4000);
      expect(tags.getOrAdd("yolo").then((record) => record.id)).to.eventually.eql(test_ID).notify(done);
    })

    it('reads a record it creates', function(done) {
      this.timeout(4000);
      expect(tags.read.byId(test_ID)
        .then((records) => records[0].tag_name))
        .to.eventually.equal("yolo")
        .notify(done);
    });

  });

});
