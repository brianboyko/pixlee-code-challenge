import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import request from 'request';
import moment from 'moment';

import {makeEndpoint, getFromIGByTag, getThisManyPhotos} from '../../src/backend/instagramInterface';

describe("./src/backend/instagramInterface", function(){
  describe('makeEndpoint()', function(){
    it('correctly creates the URL', function(){
      expect(makeEndpoint("Toronto")).to.equal("https://api.instagram.com/v1/tags/toronto/media/recent?access_token=272855367.b6f7db4.27aee70b486a4fd7b1b5546c1da0453d")
    });
  });
  describe('getFromIGByTag()', function() {
    it('gets data from the Instagram API', function(done){
      expect(getFromIGByTag("eighthdoctor").then((igResp) => {
        // igResp.data.forEach((datum, index) => {
        //   if(datum.caption.created_time){
        //     console.log(index + ": " + moment.unix(datum.caption.created_time).format("dddd, MMMM Do YYYY, h:mm:ss a"))
        //   }
        //   else(console.log(datum))
        // })
        return Object.keys(igResp)
      })).to.eventually.eql(["pagination", "meta", "data"]).notify(done);
    })
  })
  describe('getThisManyPhotos()', function(){
    it('gets a number of photos', function(done){
      this.timeout(20000)
      expect(getThisManyPhotos(60, "furball").then((bunch) => bunch.data)).to.eventually.have.length(60).notify(done);
    })
  })
});
