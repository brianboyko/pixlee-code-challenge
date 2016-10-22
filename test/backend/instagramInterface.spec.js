import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import request from 'request';
import moment from 'moment';
import bigInt from 'big-integer';

import {estimateNumberOfRequestsNeeded, getFromIGByTag, getThisManyPhotos, getTagData} from '../../src/backend/instagramInterface';

describe("./src/backend/instagramInterface", function(){

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
  describe('getTagData()', function(){
    it('gets photos', function(done){
      this.timeout(20000)
      expect(getTagData("nootnoot").then((igResp) => {
        return {
          success: igResp.meta.code === 200,
          name: igResp.data.name === "nootnoot",
          media_count: igResp.data.media_count > 1000,
        }
      })).to.eventually.eql({
        success: true,
        name: true,
        media_count: true,
      }).notify(done);
    })
  })
  describe('estimateNumberOfRequestsNeeded()', function(){
    it('estimates the number of requests needed', function(done){
      this.timeout(20000)
      const HOUR = 3600000;
      expect(
        estimateNumberOfRequestsNeeded(
          'nootnoot',
          {
            startDate: Date.now() - (2 * HOUR),
            endDate: Date.now()
          })
      ).to.eventually.be.above(100).notify(done);
    })
  })
});
