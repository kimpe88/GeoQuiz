var expect = require('expect');
var utils = require('./utils');
var Game = require('../models/game');
var Question = require('../models/question');

describe('find game', function() {
  var game;
  beforeEach(function(done) {
    Game.findOne(function(err, foundGame){
      game = foundGame;
      return done();
    });
  });

  it('finds game by id', function(done) {
    Game.findById(game._id, function(err, results) {
      if(err) console.log(err);
      expect(results._id).toEqual(game._id);
      return done();
    });
  });
});
