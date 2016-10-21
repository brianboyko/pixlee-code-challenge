import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import request from 'request';
import moment from 'moment';
import bigInt from 'big-integer';

import {makeEndpoint, getFromIGByTag, getThisManyPhotos} from '../../src/backend/instagramInterface';

describe("./src/backend/instagramInterface", function(){
  describe('makeEndpoint()', function(){
    it('correctly creates the URL', function(){
      expect(makeEndpoint("Toronto")).to.equal("https://api.instagram.com/v1/tags/toronto/media/recent")
    });
  });
  describe('getFromIGByTag()', function() {
    it('gets data from the Instagram API', function(done){
      expect(getFromIGByTag("eighthdoctor").then((igResp) => Object.keys(igResp))).to.eventually.eql(["pagination", "meta", "data"]).notify(done);
    })
  })
  describe('getThisManyPhotos()', function(){
    it('gets a number of photos', function(done){
      this.timeout(20000)
      expect(getThisManyPhotos(60, "furball").then((bunch) => bunch.data)).to.eventually.have.length(60).notify(done);
    })
  })
  describe('solving the puzzle', function(){
    it('trying to solve the puzzle. ', function(done){
      expect(getFromIGByTag("cats").then((igResp) => {
        let maxId = igResp.pagination.next_max_id;
        let minId = igResp.pagination.next_min_id;
        let dateMax = igResp.data[0].created_time
        let dateMin = igResp.data[igResp.data.length - 1].created_time;
// what if we just arbitrarily add a number?
        console.log("dateMax:", dateMax);
        console.log("dateMin:", dateMin);
        console.log("maxId(radix 64)", bigInt(maxId, 64).toString());
        console.log("minId(radix 64)", bigInt(minId, 64).toString());
        console.log("difference dateMax - dateMin", dateMax - dateMin);
        console.log("difference maxID - minId", bigInt(maxId, 64).subtract(bigInt(minId, 64)))
        return true;
      })).to.eventually.equal(true).notify(done);

    })
  })
});
