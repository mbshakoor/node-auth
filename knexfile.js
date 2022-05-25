// const dbConfig = require("./src/config/db");
// require("dotenv").config()
// // import RefreshTokenSchema from "./src/models/refreshToken.model";

// // const sequelize = new Sequelize({
// //     username: dbConfig.username,
// //     password: dbConfig.password,
// //     host: dbConfig.host,
// //     dialect: dbConfig.dialect,
// //     database: dbConfig.database,
// // });

// // const dbConfig = require("../config/database");
// const logCat = require("./src/library/logger")("sql");
// const knex = require("knex");
// const setupPaginator = require("./src/library/knex-paginator");

// const enviroments = {
//   client: "postgresql",
//   connection: {
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     charset: "utf8",
//   },
//   pool: {
//     min: 2,
//     max: 10,
//   },
//   migrations: {
//     tableName: "knex_migrations",
//   },
// };

// module.exports = {
//   development: {...enviroments},
//   staging: {...enviroments},
//   production: {...enviroments},
// };


require("dotenv").config()

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      charset: 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
      client: 'postgresql',
      connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        charset: 'utf8'
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
  },

  production: {
      client: 'postgresql',
      connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        charset: 'utf8'
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
  }
  
};