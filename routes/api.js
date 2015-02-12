var express = require('express');
var User = require('../models/user');
var Game = require('../models/game');
var Question = require('../models/question');
var router = express.Router();

router.post('/create_game', function(req, res) {
  var userId = req.body.userId;
  var lat = req.body.lat;
  var long = req.body.long;
  // If not all request params are supplied
  // respond with an error message
  if(!userId || !lat || !long){
    return invalidRequest(res);
  }

  console.log(userId);
  User.findById(userId)
  .populate('currentGame')
  .exec(function(err, user) {
    if(err || !user) return invalidRequest(res);

    //if(user.currentGame){
      //Game.remove(user.currentGame);
    //}
    //
    
    var newGame = Game({timeOut: new Date()});
    Question.randomQuestion(function(err, question){
      console.log(question);
    });


    res.status(201);
    res.json(user);
  });

});


function invalidRequest(res){
  var err = {
    success: false,
    message: 'required request params not supplied'
  };
  res.status(400);
  res.json(err);
}

module.exports = router;
