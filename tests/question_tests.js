var expect = require('expect');
var utils = require('./utils');
var Question = require('../models/question');

describe('finding quetions', function() {
  var question;
  beforeEach(function(done) {
    question = new Question({
        questionText: "How many fingers does a human have?",
        alternatives: ["1", "5", "7", "10"],
        correctAlternative: 3
    });
    question.save(done);
  });
  afterEach(function(done) {
    question.remove(done);
  });
  it('finds question by id', function(done) {
    Question.find({_id: question._id}, function(err, results){
      if(err) console.log(err);
      expect(results[0]._id).toEqual(question._id);
      return done();
    });
  });
});
