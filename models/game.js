var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Game model
// Create a schema for storing games in progress
var gameSchema = Schema({
   timeOut: Date,
   user: { type: Schema.Types.ObjectId, ref: 'User'  },
   question: { type: Schema.Types.ObjectId, ref: 'Question'  }
});

/*
Checks if the user chose the correct alternativ
@param {Number} alternative
@param {Function} callback true or false
*/
gameSchema.methods.correctAlternative = function(alternative, callback) {
 this.populate('question').exec(function(err, story) {
   if(err) throw err;
   if(this.question.correctAlternative === alternative)
     return callback(true);
   else
     return callback(false);
 });
};
var Game;
if (mongoose.models.Game) {
 Game = mongoose.model('Game');
} else {
 Game = mongoose.model('Game', gameSchema);
}
module.exports = Game;
