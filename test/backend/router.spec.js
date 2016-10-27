import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import request from 'request';
import cheerio from 'cheerio';
chai.use(chaiAsPromised);
const expect = chai.expect;
const PORT = process.env.PORT || 3000;

describe("router", function(){
  it('should get the homepage.', function(done) {
    const getter = () => new Promise(function(resolve, reject) {
      request.get('http://localhost:' + PORT + "/", (err, response, body) => {
        if (err) {
          reject(err);
        }
        let $page = cheerio.load(body);
        resolve($page('title').text());
      });
    });
    expect(getter())
      .to.eventually.equal("Pixlee Code Challenge")
      .notify(done);
  });

});
