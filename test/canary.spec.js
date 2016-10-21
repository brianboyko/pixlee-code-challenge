// Canary test for ES6
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import {canary, asyncCanary} from "../src/canary";

describe('canary.js', function(){
  describe('canary()', function(){
    it('should correctly parse ES6', function(){
      expect(canary("cheep!")).to.equal("The canary says: cheep!")
    })
  })
  describe('asyncCanary', function(){
    it('should correctly parse ES6 promises', function(done){
      expect(asyncCanary("cheep cheep!"))
        .to.eventually.equal("The canary says: cheep cheep!").notify(done);
    })
  })
})
