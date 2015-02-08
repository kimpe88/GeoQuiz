var request = require('supertest');
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
