const { body, param } = require('express-validator');
const { APPLICATION_STATUS } = require('../config/constants');

const applyJobValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid job ID'),
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Cover letter cannot exceed 2000 characters'),
  body('resumeUrl')
    .optional()
    .trim(),
];

const updateStatusValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid application ID'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn([
      APPLICATION_STATUS.APPLIED,
      APPLICATION_STATUS.SHORTLISTED,
      APPLICATION_STATUS.REJECTED,
      APPLICATION_STATUS.HIRED,
    ])
    .withMessage('Invalid application status'),
];

module.exports = {
  applyJobValidator,
  updateStatusValidator,
};
