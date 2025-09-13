const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Timetable = require('../models/Timetable');
const LostFound = require('../models/LostFound');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await User.deleteMany({});
    await Announcement.deleteMany({});
    await Timetable.deleteMany({});
    await LostFound.deleteMany({});
    
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
    
    // Create sample timetables
    const timetables = [
      {
        userId: adminUser._id,
        subject: 'Computer Science',
        day: 'Monday',
        time: '09:00-10:30',
        room: 'CS-101',
        professor: 'Dr. Smith'
      },
      {
        userId: adminUser._id,
        subject: 'Mathematics',
        day: 'Monday',
        time: '11:00-12:30',
        room: 'MATH-201',
        professor: 'Dr. Johnson'
      },
      {
        userId: adminUser._id,
        subject: 'Physics',
        day: 'Tuesday',
        time: '09:00-10:30',
        room: 'PHY-101',
        professor: 'Dr. Brown'
      },
      {
        userId: adminUser._id,
        subject: 'English',
        day: 'Wednesday',
        time: '14:00-15:30',
        room: 'ENG-301',
        professor: 'Prof. Davis'
      }
    ];
    
    await Timetable.insertMany(timetables);
    
    // Create sample lost & found items
    const lostFoundItems = [
      {
        title: 'Lost ID Card',
        description: 'Student ID card with name John Doe, lost near library',
        type: 'lost',
        category: 'documents',
        userId: adminUser._id,
        contactInfo: 'john.doe@campus.edu',
        location: 'Library'
      },
      {
        title: 'Found Calculator',
        description: 'Scientific calculator found in Math building, room 201',
        type: 'found',
        category: 'electronics',
        userId: adminUser._id,
        contactInfo: 'admin@campus.edu',
        location: 'Math Building'
      },
      {
        title: 'Lost Wallet',
        description: 'Black leather wallet with credit cards, lost in cafeteria',
        type: 'lost',
        category: 'personal',
        userId: adminUser._id,
        contactInfo: 'student@campus.edu',
        location: 'Cafeteria'
      }
    ];
    
    await LostFound.insertMany(lostFoundItems);
    
    // Create class content/notes for each subject
    const ClassContent = require('../models/ClassContent');
    await ClassContent.deleteMany({});
    
    const classContents = [
      {
        subject: 'Computer Science',
        day: 'Monday',
        date: '2024-01-15',
        topic: 'Introduction to Algorithms',
        content: 'Covered Big O notation, time complexity analysis, and basic sorting algorithms like bubble sort and selection sort. Homework: Practice problems 1-5 from Chapter 2.',
        professor: 'Dr. Smith'
      },
      {
        subject: 'Software Engineering',
        day: 'Thursday', 
        date: '2024-01-18',
        topic: 'SDLC Models and Agile Methodology',
        content: 'Discussed Waterfall vs Agile development, Scrum framework, sprint planning, and user stories. Covered SOLID principles and design patterns. Next class: Requirements gathering techniques.',
        professor: 'Prof. Lee'
      },
      {
        subject: 'Database Systems',
        day: 'Wednesday',
        date: '2024-01-17', 
        topic: 'SQL Joins and Subqueries',
        content: 'Practiced INNER JOIN, LEFT JOIN, RIGHT JOIN operations. Covered correlated and non-correlated subqueries. Assignment: Complete database design project Phase 1.',
        professor: 'Dr. Martinez'
      },
      {
        subject: 'Data Structures',
        day: 'Tuesday',
        date: '2024-01-16',
        topic: 'Linked Lists and Stack Implementation', 
        content: 'Implemented singly and doubly linked lists in C++. Covered stack operations (push, pop, peek) and applications. Lab exercise: Build a calculator using stacks.',
        professor: 'Prof. Anderson'
      },
      {
        subject: 'Physics',
        day: 'Tuesday',
        date: '2024-01-16',
        topic: 'Electromagnetic Waves and Optics',
        content: 'Studied wave properties, reflection, refraction, and interference patterns. Solved problems on lens equations and mirror formulas. Quiz next week on Chapter 12.',
        professor: 'Dr. Brown'
      }
    ];
    
    await ClassContent.insertMany(classContents);
    
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