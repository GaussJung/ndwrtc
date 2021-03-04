var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.send("==========");
  res.render('index', { title: 'Express-Connected Test V1.0' });
});

module.exports = router;
