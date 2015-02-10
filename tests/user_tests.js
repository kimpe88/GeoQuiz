var expect = require('expect');
var utils = require('./utils');
var User = require('../models/models').User;

describe('finds user', function() {
  var user;
  beforeEach(function(done) {
    user = new User({ username: 'test', authToken: 'dfadf' });
    user.save(done);
  });
  afterEach(function(done) {
    user.remove(done);
  });

  it('finds user by id', function(done) {
    User.find({username: 'test'}, function(err, results) {
      if(err) console.log(err);
      expect(results[0].username).toEqual(user.username);
      return done();
    });
  });

  it('finds user by authToken', function(done) {
    User.find({authToken: 'dfadf'}, function(err, results) {
      if(err) console.log(err);
      expect(results[0].authToken).toEqual(user.authToken);
      return done();
    });
  });
});
