
import config from '../../../knexfile.js';
import Knex from 'knex';
const ENV = "test";
const knex = Knex(config[ENV]);
knex.migrate.latest([config]);



export default knex
