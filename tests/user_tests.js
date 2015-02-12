var expect = require('expect');
var utils = require('./utils');
var User = require('../models/user');

describe('finds user', function() {
  var user;
  beforeEach(function(done) {
    User.findOne(function(err, foundUser){
      user = foundUser;
      return done();
    });
  });

  it('finds user by name', function(done) {
    User.find({ username: user.username }, function(err, results) {
      if(err) console.log(err);
      expect(results[0].username).toEqual(user.username);
      return done();
    });
  });

  it('finds user by authToken', function(done) {
    User.find({ authToken: user.authToken }, function(err, results) {
      if(err) console.log(err);
      expect(results[0].authToken).toEqual(user.authToken);
      return done();
    });
  });
});
