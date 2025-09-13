const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await User.deleteMany({});
    await Announcement.deleteMany({});
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@campus.edu',
      password: 'admin123',
      studentId: 'ADMIN001'
    });
    await adminUser.save();
    
    // Create sample announcements
    const announcements = [
      {
        title: 'Welcome to New Semester',
        content: 'Welcome back students! The new semester begins next week. Please check your timetables.',
        category: 'academic',
        priority: 'high',
        author: 'Admin User'
      },
      {
        title: 'Library Hours Extended',
        content: 'Library will now be open until 10 PM on weekdays during exam period.',
        category: 'general',
        priority: 'medium',
        author: 'Admin User'
      },
      {
        title: 'Campus Festival Next Month',
        content: 'Annual campus festival will be held next month. Registration starts soon!',
        category: 'event',
        priority: 'medium',
        author: 'Admin User'
      }
    ];
    
    await Announcement.insertMany(announcements);
    
    console.log('Sample data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;