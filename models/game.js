var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Question = require('../models/question');
// Game model
// Create a schema for storing games in progress
var gameSchema = Schema({
   timeOut: Date,
   question: { type: Schema.Types.ObjectId, ref: 'Question'  }
});

/*
Checks if the user chose the correct alternativ
@param {Number} alternative
@param {Function} callback err & true or false
*/

gameSchema.methods.checkAnswer = function(alternative, callback) {
  this.populate('question', function(err, game) {
    if(err) return callback(err,false);
    if(game.question.correctAlternative === alternative)
      return callback(null,true);
    else
      return callback(null,false);
 });
};
var Game;
if (mongoose.models.Game) {
 Game = mongoose.model('Game');
} else {
 Game = mongoose.model('Game', gameSchema);
}
module.exports = Game;
