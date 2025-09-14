const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can only enroll in a class once
timetableSchema.index({ userId: 1, classId: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);