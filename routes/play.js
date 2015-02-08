var express = require('express');
var router = express.Router();

router.get('/howtoplay', function(req, res) {
  res.render('howtoplay', { title: 'Express' });
});

module.exports = router;
