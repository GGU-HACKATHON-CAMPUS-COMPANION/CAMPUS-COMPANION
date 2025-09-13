const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('studentId').trim().isLength({ min: 3, max: 20 }).withMessage('Student ID must be 3-20 characters'),
  handleValidationErrors
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  handleValidationErrors
];

const announcementValidation = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('content').trim().isLength({ min: 10, max: 1000 }).withMessage('Content must be 10-1000 characters'),
  body('category').optional().isIn(['academic', 'event', 'general', 'urgent']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  handleValidationErrors
];

const timetableValidation = [
  body('subject').trim().isLength({ min: 2, max: 50 }).withMessage('Subject must be 2-50 characters'),
  body('instructor').trim().isLength({ min: 2, max: 50 }).withMessage('Instructor name must be 2-50 characters'),
  body('room').trim().isLength({ min: 1, max: 20 }).withMessage('Room must be 1-20 characters'),
  body('day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']).withMessage('Invalid day'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format (HH:MM)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format (HH:MM)'),
  body('semester').trim().isLength({ min: 1, max: 20 }).withMessage('Semester required'),
  handleValidationErrors
];

const lostFoundValidation = [
  body('type').isIn(['lost', 'found']).withMessage('Type must be lost or found'),
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be 10-500 characters'),
  body('category').optional().isIn(['electronics', 'books', 'clothing', 'accessories', 'documents', 'other']).withMessage('Invalid category'),
  body('location').trim().isLength({ min: 2, max: 100 }).withMessage('Location must be 2-100 characters'),
  body('contactInfo').trim().isLength({ min: 5, max: 100 }).withMessage('Contact info must be 5-100 characters'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  announcementValidation,
  timetableValidation,
  lostFoundValidation
};