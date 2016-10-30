// knexfile.js must go in / (root);

let databaseURL = process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/pixlee_dev'



module.exports = {
  development: {
    client: 'pg',
    connection: databaseURL,
    migrations: {
      directory: "./bin/server/migrations",
      tableName: "version"
    },
  },
  production: {
    client: 'pg',
    connection: databaseURL,
  },
  migrations: {
    directory: "./bin/server/migrations",
    tableName: "version"
  },
};
