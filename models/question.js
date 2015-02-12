var mongoose = require('mongoose');
// Question model
var questionSchema = mongoose.Schema({
    questionText: String,
    alternatives: [String],
    correctAlternative: Number
});

var Question;
/* Returns a random question from the pool
 * @param {Function} callback with 2 arguments error 
 * and variable to put result
 */
questionSchema.statics.randomQuestion = function(callback){
Question.count().exec(function(err, count){
  var random = Math.floor(Math.random() * count);
  Question.findOne().skip(random).exec(function(err, question){
    return callback(err,question);
  });

});
};
if (mongoose.models.Question) {
  Question = mongoose.model('Question');
} else {
  Question = mongoose.model('Question', questionSchema);
}
module.exports = Question;
