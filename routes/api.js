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
 * requires basic http auth
 * @param {Decimal} lat
 * @param {Decimal} long
 */
router.post('/create_game', function(req, res) {
  var lat = req.body.lat;
  var long = req.body.long;
  // If not all request params are supplied
  // respond with an error message
  if(!lat || !long){
    return invalidRequest(res, "lat or long");
  }

  // Execute the functions in order with return values of
  // previous function as input
  async.waterfall([
    function(callback){
      User.findOne({username: req.user.username}).populate('currentGame')
      .exec(function(err, user) {
        if(user === null)
          return errorRequest(res, "user error");

        // If user is already in a game, remove it
        // before creating a new one
        if(user.currentGame){
          Game.remove(user.currentGame);
        }
        var newGame = Game({
          timeOut: new Date(),
          lat: lat,
          long: long
        });
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
        var details = {
          questionText: question.questionText,
          alternatives: question.alternatives,
          lives: newGame.lives
        };
        return callback(err, user, details);
      });
    },
    function(user, details, callback){
      user.save(function(err){
        return callback(err, details);
      });
    }
  ],
    function(err, details){
      if(err){
        return errorRequest(res, "failed to create game");
      }
      res.status(201);
      return res.json(details);
    }
  );
});

/* listens for post request to /api/check_answer
 * checks if provided answer is correct or not
 * and whether answer was provided before timeout
 * requires basic http auth
 * @param {Number} choosenAlternative
 */
router.get('/check_answer', function(req, res){
  var chosenAlternative = req.query.chosenAlternative;
  if(chosenAlternative === undefined)
    return invalidRequest(res, "chosenAlternative");
  async.waterfall([
    function(callback){
      User.findById(req.user._id)
      .populate('currentGame')
      .exec(function(err,user){
        if(user === null)
          return errorRequest(res, "user");
        var results = {
          timedOut: user.currentGame.hasTimedOut(),
        };
        return callback(err,user, results);
      });
    },
    function(user, results, callback){
      user.currentGame.checkAnswer(chosenAlternative, function(err, correct){
        results.correctAnswer = correct;
        // Decrement lives if they answered incorrectly
        if (!correct){
          user.currentGame.lives--;
        } else {
          user.currentGame.score++;
        }
        results.lives = user.currentGame.lives;
        results.score = user.currentGame.score;
        return callback(err, user, results);
      });
    },
    function(user, results, callback) {
      user.currentGame.save(function(err){
        // If we have no lives left there's no point
        // to continue with fetching a question
        if(user.currentGame.lives <= 0) {
          res.status(200);
          return res.json(results);
        }
        return callback(err, user, results);
      });
    },
    function(user,results,callback){
      // Create a new question
      user.currentGame.timeOut = new Date();
      Question.randomQuestion(function(err,question){
        user.currentGame.question = question;
        user.currentGame.save(function(err){
          results.nextQuestion = {
            questionText: question.questionText,
            alternatives: question.alternatives,
          };
          return callback(err, results);
        });
      });
    }
    ],
    function(err, results){
      if(err) return errorRequest(res, "failed to check answer");

      res.status(200);
      return res.json(results);
    }
  );
});

function errorRequest(res, message){
  var err = {
    success: false,
    message: 'Internal server error: ' + message
  };
  res.status(500);
  return res.json(err);
}
function invalidRequest(res, paramName){
  var err = {
    success: false,
    message: 'required request params not supplied, missing ' + paramName
  };
  res.status(400);
  return res.json(err);
}

module.exports = router;
