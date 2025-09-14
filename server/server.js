const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const announcementRoutes = require('./routes/announcements');
const timetableRoutes = require('./routes/timetables');
const lostFoundRoutes = require('./routes/lostfound');
const classRoutes = require('./routes/classes');
const uploadRoutes = require('./routes/upload');
const upload = require('./middleware/upload');

const app = express();

// Compression middleware (should be early in the stack)
app.use(compression());

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// CORS configuration for production
const allowedOrigins = [
  process.env.CHATBOT_URL,
  'http://localhost:3000',
  'http://localhost:5173', 
  'http://127.0.0.1:5500',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL,
  process.env.NETLIFY_URL
].filter(Boolean);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? allowedOrigins : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
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
app.use('/api/upload', uploadRoutes);

// Public Chatbot Routes (No Auth Required)
const Timetable = require('./models/Timetable');
const Announcement = require('./models/Announcement');
const LostFound = require('./models/LostFound');

// Public timetable access for chatbot
app.get('/api/chatbot/timetables',  async (req, res) => {
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

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Test upload route
app.post('/api/test-upload', upload.single('image'), (req, res) => {
  console.log('Test upload - Body:', req.body);
  console.log('Test upload - File:', req.file);
  res.json({ 
    message: 'Upload test successful',
    body: req.body,
    file: req.file ? { name: req.file.originalname, size: req.file.size } : null
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    console.log('Unexpected field error:', err.field);
    return res.status(400).json({ message: `Unexpected field: ${err.field}` });
  }
  if (err.message && err.message.includes('Unexpected field')) {
    return res.status(400).json({ message: err.message });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection with retry logic and performance optimizations
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});