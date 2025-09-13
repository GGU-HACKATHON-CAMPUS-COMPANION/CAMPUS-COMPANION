const mongoose = require('mongoose');

const classContentSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  professor: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ClassContent', classContentSchema);