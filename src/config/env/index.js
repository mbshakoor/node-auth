const env = process.env.NODE_ENV || "development";
const appConfig = require(`./${env}`);
module.exports= appConfig;