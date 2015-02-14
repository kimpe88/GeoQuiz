var expect = require('expect');
var utils = require('./utils');
var Question = require('../models/question');

describe('finding questions', function() {
  var question;
  beforeEach(function(done) {
    Question.findOne(function(err, foundQuestion){
      if(err) throw err;
      question = foundQuestion;
      return done();
    });
  });
  it('finds question by id', function(done) {
    Question.findById(question._id, function(err, result){
      if(err) console.log(err);
      expect(result._id).toEqual(question._id);
      return done();
    });
  });
});
