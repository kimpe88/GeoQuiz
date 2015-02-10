var mongoose = require('mongoose');

// User model
// Create a schema for user information
var userSchema = mongoose.Schema({
  username: String,
  authToken: String
});
var User;
if (mongoose.models.User) {
  User = mongoose.model('User');
} else {
  User = mongoose.model('User', userSchema);
}

// Question model
var questionSchema = mongoose.Schema({
    questionText: String,
    alternatives: [String],
    correctAlternative: Number
});
var Question;
if (mongoose.models.Question) {
  Question = mongoose.model('Question');
} else {
  Question = mongoose.model('Question', questionSchema);
}

// Game model
// Create a schema for storing games in progress
//var gameSchema = mongoose.Schema({
    //timeOut: Date,
    //user: { type: Schema.Types.ObjectId, ref: 'User'  },
    //question: { type: Schema.Types.ObjectId, ref: 'Question'  }
//});

/**
 * Checks if the user chose the correct alternativ
 * @param {Number} alternative
 * @param {Function} callback true or false
 */
//gameSchema.methods.correctAlternative = function(alternative, callback) {
  //this.populate('question').exec(function(err, story) {
    //if(err) throw err;
    //if(this.question.correctAlternative === alternative)
      //return callback(true);
    //else
      //return callback(false);
  //});
//};
//var Game;
//if (mongoose.models.Game) {
  //Game = mongoose.model('Game');
//} else {
  //Game = mongoose.model('Game', gameSchema);
//}

exports.User = User;
//exports.Game = Game;
exports.Question = Question;

