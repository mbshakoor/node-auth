const express = require('express');
const app = express();
const appConfig = require('./config/env');
const indexRouter = require('./routes');
const session = require('express-session');
const device = require('express-device');
const db = require("./library/db.js")

const { PORT , SESSION_TIME, SESSION_SECRET} = appConfig

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: SESSION_TIME*60000}
}));

app.use(device.capture());

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log(`Server is running at`, PORT);
});