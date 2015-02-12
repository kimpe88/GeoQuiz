var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User model
// Create a schema for user information
var userSchema = mongoose.Schema({
  username: String,
  authToken: String,
  currentGame: { type: Schema.Types.ObjectId, ref: 'Game'  }
});
var User;
if (mongoose.models.User) {
  User = mongoose.model('User');
} else {
  User = mongoose.model('User', userSchema);
}

module.exports = User;
