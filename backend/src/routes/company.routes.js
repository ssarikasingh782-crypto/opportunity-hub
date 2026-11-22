const express = require('express');
const router = express.Router();

const {
  createCompany,
  getMyCompany,
  getCompanyById,
  updateCompany,
} = require('../controllers/company.controller');

const {
  createCompanyValidator,
  updateCompanyValidator,
} = require('../validators/company.validator');

const validate = require('../middlewares/validate.middleware');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { ROLES } = require('../config/constants');

// Public routes
router.get('/:id', getCompanyById);

// Recruiter-only routes
router.post(
  '/',
  protect,
  restrictTo(ROLES.RECRUITER),
  validate(createCompanyValidator),
  createCompany
);

router.get(
  '/me',
  protect,
  restrictTo(ROLES.RECRUITER),
  getMyCompany
);

router.put(
  '/:id',
  protect,
  restrictTo(ROLES.RECRUITER, ROLES.ADMIN),
  validate(updateCompanyValidator),
  updateCompany
);

module.exports = router;
