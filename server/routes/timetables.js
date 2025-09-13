const express = require('express');
const Timetable = require('../models/Timetable');
const auth = require('../middleware/auth');
const { timetableValidation } = require('../utils/validation');
const router = express.Router();

// Get user's timetable
router.get('/', auth, async (req, res) => {
  try {
    const timetable = await Timetable.find({ userId: req.user._id })
      .sort({ day: 1, startTime: 1 });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add timetable entry    
router.post('/', auth, timetableValidation, async (req, res) => {
  try {
    const { subject, instructor, room, day, startTime, endTime, semester } = req.body;
    
    const timetableEntry = new Timetable({
      userId: req.user._id,
      subject,
      instructor,
      room,
      day,
      startTime,
      endTime,
      semester
    });

    await timetableEntry.save();
    res.status(201).json(timetableEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get timetable by day
router.get('/day/:day', auth, async (req, res) => {
  try {
    const timetable = await Timetable.find({ 
      userId: req.user._id, 
      day: req.params.day 
    }).sort({ startTime: 1 });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete timetable entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const timetableEntry = await Timetable.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!timetableEntry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }
    
    res.json({ message: 'Timetable entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;