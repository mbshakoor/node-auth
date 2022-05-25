const express = require('express');
const router = express.Router();

const authRouter = require('./auth/routes');
const businessRouter = require('./business/routes');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    msg: "You got here.",
  })
});

router.use('/auth', authRouter);
router.use('/business',businessRouter);

module.exports = router;
