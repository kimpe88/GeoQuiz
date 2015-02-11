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

module.exports = User;
