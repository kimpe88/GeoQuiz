var request = require('supertest');
var utils = require('./utils.js');

var app = require('../app');

describe('GET root path', function() {
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

describe('POST /api/create_game', function(done) {
  it('should fail with insufficient params', function(done) {
    request(app)
    .post('/api/create_game', {userId: "", lat: 123, long: 321})
    .expect(400, done);
  });

  it('creates a game successfully with the correct params', function() {
    request(app)
    .post('/api/create_game', {userId: "123", lat: 123, long: 321})
    .expect(201, done);
  });
});
