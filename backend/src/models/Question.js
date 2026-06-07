const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  asker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['unsolved', 'solved'],
    default: 'unsolved'
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', QuestionSchema);
