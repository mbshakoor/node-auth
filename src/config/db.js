const knexConfig = require("../../knexfile");

module.exports = {
    "development": {
        "username": knexConfig.development.connection.user,
        "password": knexConfig.development.connection.password,
        "database": knexConfig.development.connection.database,
        "host": knexConfig.development.connection.host,
        "dialect": knexConfig.development.client,
    },
    "test": {
        "username": knexConfig.staging.connection.user,
        "password": knexConfig.staging.connection.password,
        "database": knexConfig.staging.connection.database,
        "host": knexConfig.staging.connection.host,
        "dialect": knexConfig.staging.client,
    },
    "production": {
        "username": knexConfig.production.connection.user,
        "password": knexConfig.production.connection.password,
        "database": knexConfig.production.connection.database,
        "host": knexConfig.production.connection.host,
        "dialect": knexConfig.production.client,
    }
  }
  
