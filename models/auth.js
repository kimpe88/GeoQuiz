var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });
// Old facebook authenitication
//var passport = require('passport'),
//FacebookStrategy = require('passport-facebook').Strategy;

//passport.use(new FacebookStrategy({
    //clientID: process.env.FB_ID,
    //clientSecret: process.env.FB_SECRET,
    //callbackURL: "example.com/callback"
  //},
  //function(accessToken, refreshToken, profile, done) {
  ////User.findOrCreate(..., function(err, user) {
        ////if (err) { return done(err); }
        ////done(null, user);
      ////});
    //var user = {
      //"name": "Test"
    //};
    //done(null,user);
  //}
//));
//module.exports = passport;
