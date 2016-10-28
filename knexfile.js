// knexfile.js must go in / (root);

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host     : '127.0.0.1',
      user     : 'postgres',
      password : 'postgres',
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
      host     : '127.0.0.1',
      user     : 'postgres',
      password : 'postgres',
      database : 'pixlee_production'
    }
  },
  migrations: {
    directory: "./bin/server/migrations",
    tableName: "version"
  },
};
