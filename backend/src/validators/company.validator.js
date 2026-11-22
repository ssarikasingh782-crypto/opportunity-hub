const { body, param } = require('express-validator');

const createCompanyValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Company description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Company location is required'),
  body('website')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid website URL'),
];

const updateCompanyValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid company ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty')
    .isLength({ min: 2, max: 100 }),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company description cannot be empty'),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),
  body('website')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid website URL'),
];

module.exports = {
  createCompanyValidator,
  updateCompanyValidator,
};
