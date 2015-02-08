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
module.exports = router;
