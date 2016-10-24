import _ from 'lodash';
import moment from 'moment';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import knex from '../setup';
import Queries from '../../../../src/backend/database/models/Queries';

const queries = Queries(knex);

describe('./src/backend/database/models/Media.js', function(){
  describe('queries.create()', function(){
    it('creates a query record', function(done){
      expect(queries.create("StephenFry", 1477181705, 1477181800)
      .then((idResponse) => {
        console.log("idResponse", idResponse);
        return idResponse[0];
      })).to.eventually.be.a('Number').notify(done);


    })
  })
})
