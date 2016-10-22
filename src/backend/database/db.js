// it's been a while since I used Postgres.  May have to dig into my old projects.
import config from '../../../knexfile.js';
import Knex from 'knex';
const ENV = process.env.ENV || "development";
const DB = Knex.initialize(config[ENV]);
const migrateToLatest = () => {
  DB.migrate.latest(config[ENV].migrations);
}

export {
  DB as default,
  migrateToLatest,
}
