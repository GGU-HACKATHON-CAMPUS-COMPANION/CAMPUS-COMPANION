const express = require('express');
const Timetable = require('../models/Timetable');
const Class = require('../models/Class');
const ClassTiming = require('../models/ClassTiming');
const auth = require('../middleware/auth');
const { timetableValidation } = require('../utils/validation');
const router = express.Router();

// Get user's timetable with class timings
router.get('/', auth, async (req, res) => {
  try {
    const userTimetable = await Timetable.find({ userId: req.user._id })
      .populate('classId', 'className semester');
    
    if (userTimetable.length === 0) {
      return res.json([]);
    }
    
    const classIds = userTimetable.map(t => t.classId._id);
    const classTimings = await ClassTiming.find({ classId: { $in: classIds } })
      .populate('classId', 'className semester')
      .sort({ day: 1, startTime: 1 });
    
    res.json(classTimings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Enroll in a class
router.post('/enroll', auth, async (req, res) => {
  try {
    const { classId } = req.body;
    
    const existingEnrollment = await Timetable.findOne({ 
      userId: req.user._id, 
      classId 
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this class' });
    }
    
    const enrollment = new Timetable({
      userId: req.user._id,
      classId
    });
    
    await enrollment.save();
    const populatedEnrollment = await Timetable.findById(enrollment._id)
      .populate('classId', 'className semester');
    
    res.status(201).json(populatedEnrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available classes for enrollment
router.get('/classes', async (req, res) => {
  try {
    const classes = await Class.find().sort({ semester: 1, className: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new class (admin only)
router.post('/classes', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { className, semester } = req.body;
    const newClass = new Class({ className, semester });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get class timings for a specific class
router.get('/classes/:id/timings', async (req, res) => {
  try {
    const timings = await ClassTiming.find({ classId: req.params.id })
      .populate('classId', 'className semester')
      .sort({ day: 1, startTime: 1 });
    res.json(timings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add timing to class (admin only)
router.post('/classes/:id/timings', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { subject, day, startTime, endTime, instructor, date } = req.body;
    const timing = new ClassTiming({
      classId: req.params.id,
      subject,
      day,
      startTime,
      endTime,
      instructor,
      date
    });
    await timing.save();
    const populatedTiming = await ClassTiming.findById(timing._id)
      .populate('classId', 'className semester');
    res.status(201).json(populatedTiming);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete class timing (admin only)
router.delete('/timings/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    await ClassTiming.findByIdAndDelete(req.params.id);
    res.json({ message: 'Timing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all class timings (for admin)
router.get('/all-timings', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const timings = await ClassTiming.find()
      .populate('classId', 'className semester')
      .sort({ day: 1, startTime: 1 });
    res.json(timings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get timetable by day
router.get('/day/:day', auth, async (req, res) => {
  try {
    const userTimetable = await Timetable.find({ userId: req.user._id })
      .populate('classId', 'className semester');
    
    if (userTimetable.length === 0) {
      return res.json([]);
    }
    
    const classIds = userTimetable.map(t => t.classId._id);
    const dayTimings = await ClassTiming.find({ 
      classId: { $in: classIds },
      day: req.params.day 
    }).populate('classId', 'className semester')
      .sort({ startTime: 1 });
    
    res.json(dayTimings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unenroll from class
router.delete('/enroll/:classId', auth, async (req, res) => {
  try {
    const enrollment = await Timetable.findOneAndDelete({
      userId: req.user._id,
      classId: req.params.classId
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    res.json({ message: 'Unenrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;