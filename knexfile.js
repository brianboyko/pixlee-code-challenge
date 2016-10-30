// knexfile.js must go in / (root);

let host = process.env.DB_HOST || '127.0.0.1';
let user = process.env.DB_USER || 'postgres';
let dbPass = process.env.DB_PASS || 'postgres';

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host     : host,
      user     : user,
      password : pass,
      database : 'pixlee_dev'
    },
    migrations: {
      directory: "./bin/server/migrations",
      tableName: "version"
    },
  },
  production: {
    client: 'pg',
    connection: {
      host     : host,
      user     : user,
      password : pass,
      database : 'pixlee_production'
    }
  },
  migrations: {
    directory: "./bin/server/migrations",
    tableName: "version"
  },
};
