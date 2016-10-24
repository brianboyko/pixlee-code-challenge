import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import knex from '../setup';
import Queries from '../../../../src/backend/database/models/Queries';


// const queries = Queries(knex);

// describe('./src/backend/database/models/Queries.js', function() {
//
//
//   });
//
// });
