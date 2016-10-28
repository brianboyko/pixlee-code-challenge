import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import knex from '../setup';

import IgUsers from '../../../../src/backend/database/models/IgUsers';
const igUsers = IgUsers(knex);

describe('./src/backend/database/models/IgUsers.js', function() {

  describe('create and read', function() {
    before(function(done) {
      // clear the data in 'ig_users'
      knex.raw('truncate table ' + 'ig_users' + ' cascade').then(() => done());
    });

    it('creates a record', function(done) {
      this.timeout(4000);
      expect(igUsers.create({
          id: 8392383,
          username: "bondjamesbond",
          profile_picture: "http://www.jamesbond.com/glamourshots",
          full_name: "Bond, James Bond"
        })
        .then((id) => {
          return Number.isInteger(id[0]);
        }))
        .to.eventually.equal(true)
        .notify(done);
    });

    it('reads a record it creates', function(done) {
      this.timeout(4000);
      expect(igUsers.create({
          id: 8675309,
          username: "kyleSimpson",
          profile_picture: "http://www.hackreactor.com/kyle.jpg",
          full_name: "Simpson, Kyle"
        })
        .then((id) => igUsers.read.byId(id[0]))
        .then((records) => _.omit(records[0], ('id'))))
        .to.eventually.eql({
          ig_user_id: '8675309',
          ig_username: 'kyleSimpson',
          ig_profilepic: 'http://www.hackreactor.com/kyle.jpg',
          ig_fullname: 'Simpson, Kyle'
        })
        .notify(done);
    });

    it('gets records by user name', function(done){
      expect(igUsers.read.byUsername("kyleSimpson").then((records) => _.omit(records[0], ['id'])))
        .to.eventually.eql({
          ig_user_id: '8675309',
          ig_username: 'kyleSimpson',
          ig_profilepic: 'http://www.hackreactor.com/kyle.jpg',
          ig_fullname: 'Simpson, Kyle'
        })
        .notify(done);
    });
  });

});
