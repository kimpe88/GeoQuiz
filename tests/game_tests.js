var expect = require('expect');
var utils = require('./utils');
var Game = require('../models/game');
var Question = require('../models/question');

var game;
beforeEach(function(done) {
  Game.findOne(function(err, foundGame){
    game = foundGame;
    game.populate('question', function(err){
      if(err) throw err;
      return done();
    });
  });
});
describe('find game', function() {
  it('finds game by id', function(done) {
    Game.findById(game._id, function(err, results) {
      if(err) console.log(err);
      expect(results._id).toEqual(game._id);
      return done();
    });
  });
});
describe('methods', function() {
  it('returns false if incorrect alternative is given', function(done) {
    var alternative = game.question.correctAlternative + 1 % 4;
    game.checkAnswer(alternative, function(err, isCorrect){
      if(err) throw err;
      expect(isCorrect).toEqual(false);
      return done();
    });
  });

  it('returns false if invalid alternative is given', function(done) {
    var alternative = "a";
    game.checkAnswer(alternative, function(err, isCorrect){
      if(err) throw err;
      expect(isCorrect).toEqual(false);
      return done();
    });
  });

  it('returns true if correct alternative is given', function(done) {
    var alternative = game.question.correctAlternative;
    game.checkAnswer(alternative, function(err, isCorrect){
      if(err) throw err;
      expect(isCorrect).toEqual(true);
      return done();
    });
  });
});
