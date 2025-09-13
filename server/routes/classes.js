const express = require('express');
const Class = require('../models/Class');
const ClassTiming = require('../models/ClassTiming');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find().sort({ semester: 1, className: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create class
router.post('/', auth, async (req, res) => {
  try {
    const { className, semester } = req.body;
    const newClass = new Class({ className, semester });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get class timings
router.get('/:id/timings', async (req, res) => {
  try {
    const timings = await ClassTiming.find({ classId: req.params.id });
    res.json(timings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add class timing
router.post('/:id/timings', auth, async (req, res) => {
  try {
    const { day, startTime, endTime, instructor } = req.body;
    const timing = new ClassTiming({
      classId: req.params.id,
      day,
      startTime,
      endTime,
      instructor
    });
    await timing.save();
    res.status(201).json(timing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete timing
router.delete('/timings/:id', auth, async (req, res) => {
  try {
    await ClassTiming.findByIdAndDelete(req.params.id);
    res.json({ message: 'Timing deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;