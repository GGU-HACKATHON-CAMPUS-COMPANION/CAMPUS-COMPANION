const express = require('express');
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');
const { announcementValidation } = require('../utils/validation');
const router = express.Router();

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('authorId', 'name profileImage')
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
    const { title, content, category, priority, image } = req.body;
    
    const announcement = new Announcement({
      title,
      content,
      category,
      priority,
      author: req.user.name,
      authorId: req.user.userId,
      image
    });

    await announcement.save();
    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('authorId', 'name profileImage');
    res.status(201).json(populatedAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update announcement (admin only)
router.put('/:id', auth, announcementValidation, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { title, content, category, priority, image } = req.body;
    
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content, category, priority, image },
      { new: true, runValidators: true }
    ).populate('authorId', 'name profileImage');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete announcement (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
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

// Like/Unlike announcement
router.post('/:id/like', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Initialize likes array if it doesn't exist
    if (!announcement.likes) {
      announcement.likes = [];
    }

    const userId = req.user.userId.toString();
    const isLiked = announcement.likes.some(id => id.toString() === userId);

    if (isLiked) {
      return res.status(400).json({ message: 'You have already reacted to this announcement' });
    }

    announcement.likes.push(userId);

    await announcement.save();
    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('authorId', 'name profileImage');
    
    res.json({ 
      announcement: populatedAnnouncement,
      isLiked: !isLiked,
      likesCount: announcement.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Pin/Unpin announcement
router.patch('/:id/pin', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const userId = req.user.userId.toString();
    const isPinned = announcement.pinnedBy?.some(id => id.toString() === userId);

    if (isPinned) {
      announcement.pinnedBy = announcement.pinnedBy.filter(id => id.toString() !== userId);
    } else {
      if (!announcement.pinnedBy) announcement.pinnedBy = [];
      announcement.pinnedBy.push(userId);
    }

    announcement.pinned = announcement.pinnedBy.length > 0;
    await announcement.save();

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('authorId', 'name profileImage');
    
    res.json({ 
      announcement: populatedAnnouncement,
      message: `Announcement ${!isPinned ? 'pinned' : 'unpinned'} successfully`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;