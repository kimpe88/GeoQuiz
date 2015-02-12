var express = require('express');
var async = require('async');
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

  User.findById(userId)
  .populate('currentGame')
  .exec(function(err, user) {
    if(err || !user) return invalidRequest(res);

    // If user is already in a game, remove it
    // before creating a new one
    if(user.currentGame){
      Game.remove(user.currentGame);
    }

    var newGame = Game({timeOut: new Date()});
    // Execute the functions in order with return values of
    // previous function as input
    async.waterfall([
      function(callback){
        Question.randomQuestion(function(err,question){
          return callback(err,question);
        });
      },
      function(question,callback){
        newGame.question = question._id;
        user.currentGame = newGame._id;
        newGame.save(function(err){
          return callback(err,newGame,question);
        });
      }
    ],
      function(err, game, question){
        if(err){
          console.log("failed to create game " + game);
          return errorRequest(res);
        }
        var details = {
          userId: user._id,
          questionText: question.questionText,
          alternatives: question.alternatives
        };
        res.status(201);
        return res.json(details);
      }
    );
  });
});

function errorRequest(res){
  var err = {
    success: false,
    message: 'Internal server error'
  };
  res.status(500);
  return res.json(err);
}
function invalidRequest(res){
  var err = {
    success: false,
    message: 'required request params not supplied'
  };
  res.status(400);
  return res.json(err);
}

module.exports = router;
