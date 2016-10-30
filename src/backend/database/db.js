'use strict';
// it's been a while since I used Postgres.  May have to dig into my old projects.
import config from '../../../knexfile.js';
import Knex from 'knex';
const ENV = process.env.ENV || "development";
const knex = Knex(config[ENV]);

export default knex;

knex.migrate.latest([config]);
