import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import request from 'request';
const PORT = process.env.PORT || 3000;

describe("test API", function(){
  it('should GET to the test', function(done) {
    const getter = () => new Promise(function(resolve, reject) {
      request.get('http://localhost:' + PORT + "/api/test", (err, response, body) => {
        if (err) {
          reject(err);
        }
        resolve(body);
      })
    });
    expect(getter())
      .to.eventually.equal("I'm in L.A. My highlights look okay.")
      .notify(done);
  })
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

      request(options, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          resolve(body);
        }
      });
    });
    expect(poster("this_should_be_uppercase")).to.eventually.equal("THIS_SHOULD_BE_UPPERCASE").notify(done);
  })
})
