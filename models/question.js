var mongoose = require('mongoose');
// Question model
var questionSchema = mongoose.Schema({
    questionText: String,
    alternatives: [String],
    correctAlternative: Number
});
var Question;
if (mongoose.models.Question) {
  Question = mongoose.model('Question');
} else {
  Question = mongoose.model('Question', questionSchema);
}
module.exports = Question;
