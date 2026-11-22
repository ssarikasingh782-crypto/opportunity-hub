const { body, param } = require('express-validator');
const {
  JOB_TYPES,
  WORK_MODES,
  JOB_STATUS,
  EXPERIENCE_LEVELS,
} = require('../config/constants');

const createJobValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Job title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 20 })
    .withMessage('Job description must be at least 20 characters long'),
  body('type')
    .optional()
    .isIn([JOB_TYPES.JOB, JOB_TYPES.INTERNSHIP])
    .withMessage('Type must be either job or internship'),
  body('workMode')
    .optional()
    .isIn([WORK_MODES.ONSITE, WORK_MODES.REMOTE, WORK_MODES.HYBRID])
    .withMessage('Work mode must be onsite, remote, or hybrid'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('salaryMin')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number')
    .custom((val) => val >= 0)
    .withMessage('Minimum salary cannot be negative'),
  body('salaryMax')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .custom((val, { req }) => {
      if (val < 0) throw new Error('Maximum salary cannot be negative');
      if (req.body.salaryMin && Number(val) < Number(req.body.salaryMin)) {
        throw new Error('Maximum salary cannot be less than minimum salary');
      }
      return true;
    }),
  body('skills')
    .optional()
    .custom((val) => {
      if (Array.isArray(val) || typeof val === 'string') return true;
      throw new Error('Skills must be an array or comma-separated string');
    }),
  body('experienceLevel')
    .optional()
    .isIn([
      EXPERIENCE_LEVELS.ENTRY,
      EXPERIENCE_LEVELS.MID,
      EXPERIENCE_LEVELS.SENIOR,
      EXPERIENCE_LEVELS.LEAD,
    ])
    .withMessage('Invalid experience level'),
  body('openings')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Openings must be at least 1'),
];

const updateJobValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid job ID'),
  body('type')
    .optional()
    .isIn([JOB_TYPES.JOB, JOB_TYPES.INTERNSHIP])
    .withMessage('Type must be either job or internship'),
  body('workMode')
    .optional()
    .isIn([WORK_MODES.ONSITE, WORK_MODES.REMOTE, WORK_MODES.HYBRID])
    .withMessage('Work mode must be onsite, remote, or hybrid'),
  body('status')
    .optional()
    .isIn([
      JOB_STATUS.OPEN,
      JOB_STATUS.CLOSED,
      JOB_STATUS.PENDING,
      JOB_STATUS.REMOVED,
    ])
    .withMessage('Invalid job status'),
  body('openings')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Openings must be at least 1'),
];

module.exports = {
  createJobValidator,
  updateJobValidator,
};
