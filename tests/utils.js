var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var __ = require('lodash');
var Question = require('../models/question');
var User = require('../models/user');
var Game = require('../models/game');

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

beforeEach(function (done) {

  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return populateDB();
  }

  /*
   * Inserts seed data into database before any tests are run
   */
  function populateDB(){
    var questionsJsonText = fs.readFileSync('database/questions_seed.json', "utf8");
    var questionsJson = JSON.parse(questionsJsonText);
    var usersJsonText = fs.readFileSync('database/users_seed.json', "utf8");
    var usersJson = JSON.parse(usersJsonText);

    // Creates questions, games and users from seed data
    // This got quite complex due to js asynchronicity
    async.each(questionsJson, function(question, callback){
      new Question({questionText: question.questionText, alternatives: question.alternatives, correctAlternative: question.correctAlternative}).save(callback);
    }, function(err){
      if(err) throw err;
      async.each(usersJson, function(user, callback){
        Question.randomQuestion(function(err, question){
          if(err) throw err;
          var game = new Game({timeOut: Date(), question: question._id});
          game.save(function(err){
            if(err) throw err;
            new User({username: user.username, authToken: user.authToken, currentGame: game._id}).save(function(err, user){
              if(err) throw err;
              callback(err);
            });
          });
        });
      }, function(err){
        if(err) throw err;
        return done();
      });
    });
  }

  if (mongoose.connection.readyState === 0) {
  var connectURI = process.env.MONGOLAB_URI || 'mongodb://localhost/test';
    mongoose.connect(connectURI, function (err) {
      if (err) {
        throw err;
      }
      return clearDB();
    });
  } else {
    return clearDB();
  }
});

afterEach(function (done) {
  mongoose.disconnect();
  return done();
});
