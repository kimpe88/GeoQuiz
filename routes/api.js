var express = require('express');
var async = require('async');
var User = require('../models/user');
var Game = require('../models/game');
var Question = require('../models/question');
var router = express.Router();


// Does nothing except sends 200 OK if auth is successful
router.get('/', function(req, res){
  return res.sendStatus(200);
});

/* listens for post request
 * creates a new game for specified user
 * @param {String} userid
 * @param {Decimal} lat
 * @param {Decimal} long
 */
router.post('/create_game', function(req, res) {
  var lat = req.body.lat;
  var long = req.body.long;
  // If not all request params are supplied
  // respond with an error message
  if(!lat || !long){
    return invalidRequest(res);
  }

  // Execute the functions in order with return values of
  // previous function as input
  async.waterfall([
    function(callback){
      User.findOne({username: req.user.username}).populate('currentGame')
      .exec(function(err, user) {
        if(user === null)
          return invalidRequest(res);

        // If user is already in a game, remove it
        // before creating a new one
        if(user.currentGame){
          Game.remove(user.currentGame);
        }
        var newGame = Game({timeOut: new Date()});
        return callback(err, user, newGame);
      });
    },
    function(user, newGame, callback){
      Question.randomQuestion(function(err,question){
        return callback(err,user, newGame, question);
      });
    },
    function(user, newGame, question,callback){
      newGame.question = question._id;
      user.currentGame = newGame._id;
      newGame.save(function(err){
        return callback(err,user,newGame,question);
      });
    }
  ],
    function(err,user, game, question){
      if(err){
        console.log("failed to create game " + game);
        return errorRequest(res);
      }
      var details = {
        questionText: question.questionText,
        alternatives: question.alternatives
      };
      res.status(201);
      return res.json(details);
    }
  );
});

/* listens for post request to /api/check_answer
 * checks if provided answer is correct or not
 * and whether answer was provided before timeout
 * @param {String} username
 * @param {String} password
 * @param {Number} choosenAlternative
 */
router.get('/check_answer', function(req, res){
  var chosenAlternative = req.body.chosenAlternative;
  if(chosenAlternative === undefined)
    return invalidRequest(res);
  async.waterfall([
    function(callback){
      var user = User.findOne(req.user.username)
      .populate('currentGame')
      .exec(function(err,user){
        if(user === null)
          invalidRequest(res);
        var results = {timedOut: user.currentGame.hasTimedOut()};
        return callback(err,user, results);
      });
    },
    function(user, results, callback){
      user.currentGame.checkAnswer(chosenAlternative, function(err, correct){
        results.correctAnswer = correct;
        return callback(err, results);
      });
    }],
    function(err, results){
      if(err) return errorRequest(res);
      res.status(200);
      return res.json(results);
    }
  );
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
