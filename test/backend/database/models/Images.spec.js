import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import knex from '../../../../src/backend/database/db';

import sampleRecord from '../../sampleRecord';
import Images from '../../../../src/backend/database/models/Images';
const images = Images(knex);

describe('./src/backend/database/models/Images.js', function() {

  describe('create and read', function() {
    var test_ID;

    it('creates a record', function(done) {
      this.timeout(4000);
      expect(images.create(sampleRecord.images)
        .then((id) => {
          test_ID = id[0];
          return Number.isInteger(id[0]);
        }))
        .to.eventually.equal(true)
        .notify(done);
    });

    it('reads a record it creates', function(done) {
      this.timeout(4000);
      expect(images.read.byId(test_ID)
        .then((records) => _.omit(records[0], ('id'))))
        .to.eventually.eql({
          low_url: sampleRecord.images.low_resolution.url,
          low_width: sampleRecord.images.low_resolution.width,
          low_height: sampleRecord.images.low_resolution.height,
          standard_url: sampleRecord.images.standard_resolution.url,
          standard_width: sampleRecord.images.standard_resolution.width,
          standard_height: sampleRecord.images.standard_resolution.height,
          thumb_url: sampleRecord.images.thumbnail.url,
          thumb_width: sampleRecord.images.thumbnail.width,
          thumb_height: sampleRecord.images.thumbnail.height,
        })
        .notify(done);
    });

  });

});
