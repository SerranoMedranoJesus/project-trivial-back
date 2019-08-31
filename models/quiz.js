const mongoose = require('mongoose')
const Schema = mongoose.Schema

let quizSchema = new Schema ({
  question: {type: String, required: true, unique: true},
  answer: [ 
    { 
      title: {type: String, required: true}, 
      isValid: {type: Boolean, default: false}
    } 
  ]
})

quizSchema.set('toJSON', {getters: true, virtuals: false});

let QuizModel = mongoose.model('Quiz', quizSchema);

module.exports = QuizModel