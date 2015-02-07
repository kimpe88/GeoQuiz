var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('start_game');
});

router.get('/quiz', function(req, res){
  res.render('quiz');
});
module.exports = router;
