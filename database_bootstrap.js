var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var __ = require('lodash');
var Question = require('./models/question');
var User = require('./models/user');
var Game = require('./models/game');

var populateDB = function (){
  var database = process.env.NODE_ENV || 'development';
  var connectURI = process.env.MONGOLAB_URI || 'mongodb://localhost/' + database;
  mongoose.connect(connectURI);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("Successfully connected to database");
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
            new User({username: user.username, password: user.password, currentGame: game._id}).save(function(err, user){
              if(err) throw err;
              callback(err);
            });
          });
        });
      }, function(err){
        if(err) throw err;
        console.log("database loaded success");
      });
    });
});


  }
module.exports= populateDB;
