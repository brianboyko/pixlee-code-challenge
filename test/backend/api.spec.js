import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import _ from 'lodash';
import request from 'request';
import moment from 'moment';
chai.use(chaiAsPromised);
const expect = chai.expect;
const PORT = process.env.PORT || 3000;

describe("api", function() {
  it('should GET to the test', function(done) {
    const getter = () => new Promise(function(resolve, reject) {
      request.get('http://localhost:' + PORT + "/api/test", (err, response, body) => {
        if (err) {
          reject(err);
        }
        resolve(body);
      });
    });
    expect(getter())
      .to.eventually.equal("I'm in L.A. My highlights look okay.")
      .notify(done);
  });
  it('should POST and get back data to the test', function(done) {
    const poster = (string) => new Promise(function(resolve, reject) {
      let options = {
        method: 'POST',
        url: 'http://localhost:' + PORT + '/api/testPost',
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        },
        body: {
          data: string
        },
        json: true
      };

      request(options, function(error, response, body) {
        if (error) {
          reject(error);
        }
        else {
          resolve(body);
        }
      });
    });
    expect(poster("this_should_be_uppercase"))
      .to.eventually.equal("THIS_SHOULD_BE_UPPERCASE")
      .notify(done);
  });

  describe('/api/getLatest/:tagname', function() {
    it('should get the latest from instagram by tag', function(done) {
      this.timeout(4000);
      const getter = () => new Promise(function(resolve, reject) {
        request.get('http://localhost:' + PORT + "/api/getLatest/" + 'whiteboard', (err, response, body) => {
          if (err) {
            reject(err);
          }
          resolve(body);
        });
      });
      // expect all entries to have the tag "whiteboard";
      expect(getter()
        .then((body) => JSON.parse(body))
        .then((body) => body.data.reduce((pv, cv) => (pv && _.includes(cv.tags, 'whiteboard')), true)))
        .to.eventually.equal(true)
        .notify(done);
    });
  });

  describe('/api/createcollection', function() {
    this.timeout(20000);
    it('creates a collection', function(done) {
      const poster = (string) => new Promise(function(resolve, reject) {
        let options = {
          method: 'POST',
          url: 'http://localhost:' + PORT + '/api/createcollection',
          headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
          },
          body: {
            tagName: string,
            startDate: moment().unix(),
            endDate: moment().subtract(10, 'minutes').unix(),
            userEmail: 'brian.boyko@gmail.com',
          },
          json: true,
        };
        request(options, function(error, response, body) {
          if (error) {
            console.log("error", error);
            reject(error);
          }
          else {
            resolve(body);
          }
        });

      });
      expect(poster("cats")
          .then((result) => Object.assign(_.omit(result, ['id', 'placement']), {
            idIsNaN: Number.isNaN(result.id),
            placementIsNaN: Number.isNaN(result.placement)
          })))
        .to.eventually.eql({
          email: 'brian.boyko@gmail.com',
          idIsNaN: false,
          placementIsNaN: false,
        })
        .notify(done);
    });
  });

});
