import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import server from '../../src/backend/server';
const getTest = server().getTest;
describe('backend/server.js', function() {
  describe('getTest', function() {
    it('gets data from a fake API', function(done) {
      expect(getTest()).to.eventually.eql({
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
      }).notify(done) //will fail.
    })
  })
})
