var request = require('supertest');
var app = require('../app');
var User = require('../models/user');
var Question = require('../models/question');

describe('GET root path', function(done) {
  it('responds with 200 sucess', function(done) {
    request(app)
    .get('/')
    .expect(200, done);
  });

  it('contains "VikingQuest"', function(done) {
    request(app)
    .get('/')
    .expect(/VikingQuest/, done);
  });
});
describe('GET /play path', function() {
  it('responds with 200 sucess', function(done) {
    request(app)
    .get('/play')
    .expect(200, done);
  });

  it('it contains start game', function(done) {
    request(app)
    .get('/play')
    .expect(/start game/i, done);
  });

});
describe('GET /howtoplay path', function() {
  it('responds with 200 sucess', function(done) {
    request(app)
    .get('/howtoplay')
    .expect(200, done);
  });

  it('it contains Become the King of the world', function(done) {
    request(app)
    .get('/howtoplay')
    .expect(/Become the King of the world/i, done);
  });
});

describe('/api/create_game', function() {
  var user;
  beforeEach(function(done) {
    User.findOne(function(err, foundUser){
      user = foundUser;
      return done();
    });
  });


  it('should fail with insufficient params', function(done) {
    request(app)
    .post('/api/create_game')
    .send({userId: "", lat: 123, long: 321})
    .expect(400, done);
  });
  it('creates a game successfully with the correct params', function(done) {

    request(app)
    .post('/api/create_game')
    .send({userId: user._id, lat: 123, long: 321})
    .expect(201, done);
  });
});
