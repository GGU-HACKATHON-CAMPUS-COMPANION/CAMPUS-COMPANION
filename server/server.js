const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const announcementRoutes = require('./routes/announcements');
const timetableRoutes = require('./routes/timetables');
const lostFoundRoutes = require('./routes/lostfound');
const classRoutes = require('./routes/classes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/lostfound', lostFoundRoutes);

// Public Chatbot Routes (No Auth Required)
const Timetable = require('./models/Timetable');
const Announcement = require('./models/Announcement');
const LostFound = require('./models/LostFound');

// Public timetable access for chatbot
app.get('/api/chatbot/timetables', async (req, res) => {
  try {
    const { day, userId } = req.query;
    const filter = {};
    if (day) filter.day = day;
    
    const timetables = await Timetable.find(filter)
      .sort({ day: 1, startTime: 1 })
      .limit(50);
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Public announcements access for chatbot
app.get('/api/chatbot/announcements', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    
    const announcements = await Announcement.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Public lost/found access for chatbot
app.get('/api/chatbot/lostfound', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const items = await LostFound.find(filter)
      .populate('userId', 'name studentId')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.use('/api/classes', classRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});