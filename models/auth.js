var passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: "example.com/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  //User.findOrCreate(..., function(err, user) {
        //if (err) { return done(err); }
        //done(null, user);
      //});
    var user = {
      "name": "Test"
    };
    done(null,user);
  }
));
module.exports = passport;
