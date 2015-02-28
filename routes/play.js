var express = require('express');
var router = express.Router();
var User = require('../models/user');

//is mapped to /play
router.get('/', function(req, res){
  res.render('start_game');
});
module.exports = router;

//is mapped to /play/quiz
router.get('/quiz', function(req, res){
  res.render('quiz');
});

router.get('/quiz/finished', function(req, res){
  User.findOne({username: req.user.username}).populate('currentGame').exec(function(err, user){
    if(err || !user){
      res.sendStatus(500);
    }

    //TODO get or create tile for user if user's score > highscore render win page else lose page
    var score = 0, highscore = 0;
    if(score >= highscore){
      res.render('quiz_succeeded',{AREA_NAME: 'KISTA 35.20', MYRANK: 3,MYSCORE:37500});
    } else {
      res.render('quiz_failed',{AREA_NAME: 'KISTA 35.20'});
    }
  });
});


module.exports = router;
