//production.js
const dotenv = require('dotenv');
dotenv.config();

const prodConfig = {
  PORT: process.env.PORT,
  JWT_SECRET_KET: process.env.JWT_SECRET_KET,
  JWT_EXPIRATION: 360000,
  REFRESH_TOKEN_EXPIRATION: 604800000,
  AUTH_SECRET_KEY: process.env.AUTH_SECRET_KEY,
  SESSION_TIME: process.env.SESSION_TIME,
  SESSION_SECRET:process.env.SESSION_SECRET,

  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
};


module.exports= prodConfig;