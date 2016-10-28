import _ from 'lodash';
import moment from 'moment';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import knex from '../../../../src/backend/database/db';

import sampleRecord from '../../sampleRecord';
import Media from '../../../../src/backend/database/models/Media';
import IgUsers from '../../../../src/backend/database/models/IgUsers';
import Images from '../../../../src/backend/database/models/Images';

const media = Media(knex);
const igUsers = IgUsers(knex);
const images = Images(knex);

describe('./src/backend/database/models/Media.js', function() {

  describe('create and read', function() {
    var test_ID;

    it('creates a record', function(done) {
      this.timeout(4000);
      expect(media.create(sampleRecord)
        .then((id) => {
          test_ID = id[0];
          return Number.isInteger(id[0]);
        }))
        .to.eventually.equal(true)
        .notify(done);
    });

    it('reads a record it creates', function(done) {
      this.timeout(4000);
      expect(media.read.byId(test_ID)
        .then((records) => _.omit(records[0], ['image_id', 'ig_users_id', 'id'])))
        .to.eventually.eql({
          number_likes: sampleRecord.likes.count,
          number_comments: sampleRecord.comments.count,
          type: sampleRecord.type,
          attribution: sampleRecord.attribution,
          location: JSON.stringify(sampleRecord.location),
          filter: sampleRecord.filter,
          created_time: moment.unix(sampleRecord.created_time).toDate(),
          link_url: sampleRecord.link,
          caption_text: sampleRecord.caption.text,
          caption_created_time: moment.unix(sampleRecord.caption.created_time).toDate(),
        })
        .notify(done);
    });

    it('correctly writes to the image table', function(done) {
      this.timeout(4000);
      expect(media.read.byId(test_ID)
        .then((records) => records[0].image_id)
        .then((image_id) => images.read.byId(image_id))
        .then((record) => _.omit(record[0], ['id'])))
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

    it('correctly writes to the ig_users table', function(done) {
      this.timeout(4000);
      expect(media.read.byId(test_ID)
      .then((records) => records[0].ig_users_id)
      .then((id) => igUsers.read.byId(id))
      .then((record) => _.omit(record[0], ['id'])))
      .to.eventually.eql({
        ig_user_id: sampleRecord.user.id,
        ig_username: sampleRecord.user.username,
        ig_profilepic: sampleRecord.user.profile_picture,
        ig_fullname: sampleRecord.user.full_name,
      })
      .notify(done);
    })

  });

});
