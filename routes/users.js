var express = require('express');
var router = express.Router();

/* GET users listing.  : post 필요시 post 추가 */
router.get('/', function(req, res, next) {
  res.send('respond with a resource using get V1.0');
});


router.post('/', function(req, res, next) {
  res.send('respond with a resource using post V1.0 ');
});


module.exports = router;
