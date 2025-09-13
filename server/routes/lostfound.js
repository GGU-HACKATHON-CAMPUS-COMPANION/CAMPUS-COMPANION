const express = require('express');
const LostFound = require('../models/LostFound');
const auth = require('../middleware/auth');
const { lostFoundValidation } = require('../utils/validation');
const router = express.Router();

// Get all lost/found items
router.get('/', async (req, res) => {
  try {
    const { type, category, status } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const items = await LostFound.find(filter)
      .populate('userId', 'name studentId')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Post lost/found item
router.post('/', auth, lostFoundValidation, async (req, res) => {
  try {
    const { type, title, description, category, location, contactInfo } = req.body;
    
    const item = new LostFound({
      userId: req.user._id,
      type,
      title,
      description,
      category,
      location,
      contactInfo
    });

    await item.save();
    await item.populate('userId', 'name studentId');
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's posted items
router.get('/my-items', auth, async (req, res) => {
  try {
    const items = await LostFound.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const item = await LostFound.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    ).populate('userId', 'name studentId');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item (admin or owner)
router.put('/:id', auth, lostFoundValidation, async (req, res) => {
  try {
    const { type, title, description, category, location, contactInfo } = req.body;
    
    const filter = req.user.role === 'admin' 
      ? { _id: req.params.id }
      : { _id: req.params.id, userId: req.user._id };
    
    const item = await LostFound.findOneAndUpdate(
      filter,
      { type, title, description, category, location, contactInfo },
      { new: true }
    ).populate('userId', 'name studentId');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete item (admin or owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' 
      ? { _id: req.params.id }
      : { _id: req.params.id, userId: req.user._id };
    
    const item = await LostFound.findOneAndDelete(filter);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;