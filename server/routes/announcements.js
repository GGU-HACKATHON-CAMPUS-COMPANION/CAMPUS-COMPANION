const express = require('express');
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');
const { announcementValidation } = require('../utils/validation');
const router = express.Router();

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create announcement (protected route)
router.post('/', auth, announcementValidation, async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;
    
    const announcement = new Announcement({
      title,
      content,
      category,
      priority,
      author: req.user.name
    });

    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get announcements by category
router.get('/category/:category', async (req, res) => {
  try {
    const announcements = await Announcement.find({ category: req.params.category })
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;