const express = require('express');
const LostFound = require('../models/LostFound');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
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
router.post('/', auth, upload.single('image'), async (req, res) => {
  console.log('Lost/Found POST route hit');
  console.log('Body:', req.body);
  console.log('File:', req.file);
  
  try {
    const { type, title, description, category, location, contactInfo } = req.body;
    
    if (!type || !['lost', 'found'].includes(type)) {
      return res.status(400).json({ message: 'Type must be lost or found' });
    }
    if (!title || title.trim().length < 3 || title.trim().length > 100) {
      return res.status(400).json({ message: 'Title must be 3-100 characters' });
    }
    if (!description || description.trim().length < 10 || description.trim().length > 500) {
      return res.status(400).json({ message: 'Description must be 10-500 characters' });
    }
    if (!location || location.trim().length < 2 || location.trim().length > 100) {
      return res.status(400).json({ message: 'Location must be 2-100 characters' });
    }
    if (!contactInfo || contactInfo.trim().length < 5 || contactInfo.trim().length > 100) {
      return res.status(400).json({ message: 'Contact info must be 5-100 characters' });
    }

    let image = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'campus-companion/lostfound',
            transformation: [{ width: 800, height: 600, crop: 'limit' }]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      image = result.secure_url;
    }
    
    const item = new LostFound({
      userId: req.user.userId || req.user._id,
      type,
      title,
      description,
      category,
      location,
      contactInfo,
      image
    });

    await item.save();
    await item.populate('userId', 'name studentId');
    res.status(201).json(item);
  } catch (error) {
    console.error('Lost/Found POST error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's posted items
router.get('/my-items', auth, async (req, res) => {
  try {
    const items = await LostFound.find({ userId: req.user.userId || req.user._id })
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
      { _id: req.params.id, userId: req.user.userId || req.user._id },
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
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  // Manual validation after multer
  const { type, title, description, category, location, contactInfo } = req.body;
  
  if (!type || !['lost', 'found'].includes(type)) {
    return res.status(400).json({ message: 'Type must be lost or found' });
  }
  if (!title || title.trim().length < 3 || title.trim().length > 100) {
    return res.status(400).json({ message: 'Title must be 3-100 characters' });
  }
  if (!description || description.trim().length < 10 || description.trim().length > 500) {
    return res.status(400).json({ message: 'Description must be 10-500 characters' });
  }
  if (!location || location.trim().length < 2 || location.trim().length > 100) {
    return res.status(400).json({ message: 'Location must be 2-100 characters' });
  }
  if (!contactInfo || contactInfo.trim().length < 5 || contactInfo.trim().length > 100) {
    return res.status(400).json({ message: 'Contact info must be 5-100 characters' });
  }
  try {
    const { type, title, description, category, location, contactInfo } = req.body;
    const updateData = { type, title, description, category, location, contactInfo };

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'campus-companion/lostfound',
            transformation: [{ width: 800, height: 600, crop: 'limit' }]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      updateData.image = result.secure_url;
    }
    
    const filter = req.user.role === 'admin' 
      ? { _id: req.params.id }
      : { _id: req.params.id, userId: req.user.userId || req.user._id };
    
    const item = await LostFound.findOneAndUpdate(
      filter,
      updateData,
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
      : { _id: req.params.id, userId: req.user.userId || req.user._id };
    
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