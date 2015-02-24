var request = require('supertest');
var app = require('../app');
var User = require('../models/user');
var Question = require('../models/question');

var user, details;
beforeEach(function(done) {
  User.findOne().populate('currentGame').exec(function(err, foundUser){
    user = foundUser;
    details = {username: user.username, password: "password"};
    return done();
  });
});

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
    .auth(details.username, details.password)
    .expect(200, done);
  });

  it('it contains start game', function(done) {
    request(app)
    .get('/play')
    .auth(details.username, details.password)
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

describe('/api', function() {
  it('authenticates correctly', function(done) {
    request(app)
    .get('/api')
    .auth(details.username, details.password)
    .expect(200, done);
  });

  describe('/api/create_game', function() {
    it('should fail with insufficient params', function(done) {
      request(app)
      .post('/api/create_game')
      .auth(details.username, "")
      .send({lat: 123, long: 321})
      .expect(401, done);
    });
    it('creates a game successfully with the correct params', function(done) {

      request(app)
      .post('/api/create_game')
      .auth(details.username, details.password)
      .send({lat: 123, long: 321})
      .expect(201)
      .expect(/questionText/)
      .expect(/alternatives/,done);
    });
  });
  describe('/api/check_answer', function() {
    it('responds with correct answer false and time out false for wrong questions', function(done) {
      Question.findById(user.currentGame.question, function(err,question){
        var answer = question.correctAlternative + 1 % 4;
        request(app)
        .get('/api/check_answer?chosenAlternative=' + answer)
        .auth(details.username, details.password)
        .expect(200)
        .expect(function(res){
          if(res.body.correctAnswer !== false || res.body.timedOut !== false)
            throw new Error();
        })
        .end(done);
      });
    });
    it('responds with correct answer true and time out false when correct answer is given', function(done) {
      Question.findById(user.currentGame.question, function(err,question){
        if(err) throw err;
        var answer = question.correctAlternative;
        var url = '/api/check_answer?chosenAlternative=' + answer;
        request(app)
        .get(url)
        .auth(details.username, details.password)
        .expect(200)
        .expect(function(res){
          if(res.body.correctAnswer !== true || res.body.timedOut !== false)
            throw new Error();
        })
        .end(done);
      });
    });
    it('responds with false and timeOut true when time has run out on game', function(done) {
      user.currentGame.timeOut = new Date(user.currentGame.timeOut - 31000);
      user.currentGame.save(function(err){
        if(err) throw err;
        Question.findById(user.currentGame.question, function(err,question){
          var answer = question.correctAlternative;
          var url = '/api/check_answer?chosenAlternative=' + answer;
          request(app)
          .get(url)
          .auth(details.username, details.password)
          .send({chosenAlternative: answer})
          .expect(200)
          .expect(function(res){
            if(res.body.correctAnswer !== true || res.body.timedOut !== true)
              throw new Error();
          })
          .end(done);
        });
      });
    });
  });

  //describe('register_user', function() {
    
  //});
});

