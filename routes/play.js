var express = require('express');
var router = express.Router();

//is mapped to /play
router.get('/', function(req, res){
  res.render('start_game');
});
module.exports = router;

//is mapped to /play/quiz
router.get('/quiz', function(req, res){
  res.render('quiz');
});

//is mapped to /play/quiz_failed
router.get('/quiz_failed', function(req, res){
  res.render('quiz_failed',{AREA_NAME: 'KISTA 35.20'});
});


module.exports = router;
