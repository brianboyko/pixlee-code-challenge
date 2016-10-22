// knexfile.js must go in / (root);

var databasehost = process.env.POSTGRES_HOST || 'http://localhost';
var databaseport = process.env.POSTGRES_PORT || 5432;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host     : databaseHost + ":" + databasePort,
      user     : 'postgres',
      password : '',
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
      host     : databaseHost + ":" + databasePort,
      user     : 'postgres',
      password : '',
      database : 'pixlee_production'
    }
  },
  test: {
    client: 'pg',
    connection: {
      host     : databaseHost + ":" + databasePort,
      user     : 'postgres',
      password : '',
      database : 'pixlee_test'
    },
    migrations: {
      directory: "./bin/server/migrations",
      tableName: "version"
    }
  }
}
