const express = require('express');
const router = express.Router();

const {
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/application.controller');

const { updateStatusValidator } = require('../validators/application.validator');
const validate = require('../middlewares/validate.middleware');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { ROLES } = require('../config/constants');

// Candidate routes
router.get(
  '/my',
  protect,
  restrictTo(ROLES.CANDIDATE),
  getMyApplications
);

router.delete(
  '/:id',
  protect,
  restrictTo(ROLES.CANDIDATE),
  withdrawApplication
);

// Recruiter / Admin routes
router.put(
  '/:id/status',
  protect,
  restrictTo(ROLES.RECRUITER, ROLES.ADMIN),
  validate(updateStatusValidator),
  updateApplicationStatus
);

module.exports = router;
