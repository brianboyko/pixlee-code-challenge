import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import request from 'request';

import {makeEndpoint, getFromIGByTag} from '../../src/backend/instagramInterface';

describe("./src/backend/instagramInterface", function(){
  describe('makeEndpoint()', function(){
    it('correctly creates the URL', function(){
      expect(makeEndpoint("Toronto")).to.equal("https://api.instagram.com/v1/tags/toronto/media/recent?access_token=272855367.b6f7db4.27aee70b486a4fd7b1b5546c1da0453d")
    });
  });
  describe('getFromIGByTag', function() {
    it('gets data from the Instagram API', function(done){
      expect(getFromIGByTag("Toronto").then((igResp) => Object.keys(igResp))).to.eventually.eql(["pagination", "meta", "data"]).notify(done);
    })
  })
});
