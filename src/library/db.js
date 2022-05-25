const dbConfig = require("../config/db");
const logCat = require("../library/logger")("sql");
const knex = require('knex')
const setupPaginator = require('./knex-paginator');

let db = knex({
  debug: process.env.NODE_ENV == "production" ? false : true,
  // debug: true,
  client: dbConfig[process.env.NODE_ENV].dialect,
  connection: {
    host: dbConfig[process.env.NODE_ENV].host,
    user: dbConfig[process.env.NODE_ENV].username,
    password: dbConfig[process.env.NODE_ENV].password,
    database: dbConfig[process.env.NODE_ENV].database,
    port:5433,
    pool: {
      autostart: true,
      max: 10,
      min: 2,
      propagateCreateError: false
    },
  },
  log: {
    warn(message) {
      logCat(`warn: ${JSON.stringify(message)}`);
    },
    error(message) {
      logCat(`error: ${JSON.stringify(message)}`);
    },
    deprecate(message) {
      logCat(`deprecate: ${JSON.stringify(message)}`);
    },
    debug(message) {
      logCat(`debug: ${JSON.stringify(message)}`);
    }
  }
});
setupPaginator(db);
module.exports = db