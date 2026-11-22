const express = require('express');
const router = express.Router();

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require('../controllers/job.controller');

const {
  applyToJob,
  getJobApplications,
} = require('../controllers/application.controller');

const {
  createJobValidator,
  updateJobValidator,
} = require('../validators/job.validator');

const { applyJobValidator } = require('../validators/application.validator');

const validate = require('../middlewares/validate.middleware');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { ROLES } = require('../config/constants');

// Public routes
router.get('/', getJobs);

// Recruiter "my jobs" route (must be placed before /:id)
router.get(
  '/my',
  protect,
  restrictTo(ROLES.RECRUITER),
  getMyJobs
);

router.get('/:id', getJobById);

// Recruiter job creation
router.post(
  '/',
  protect,
  restrictTo(ROLES.RECRUITER),
  validate(createJobValidator),
  createJob
);

// Recruiter owner / Admin job update & delete
router.put(
  '/:id',
  protect,
  restrictTo(ROLES.RECRUITER, ROLES.ADMIN),
  validate(updateJobValidator),
  updateJob
);

router.delete(
  '/:id',
  protect,
  restrictTo(ROLES.RECRUITER, ROLES.ADMIN),
  deleteJob
);

// Job application nested endpoints:
// POST /api/v1/jobs/:id/apply (Candidate only)
router.post(
  '/:id/apply',
  protect,
  restrictTo(ROLES.CANDIDATE),
  validate(applyJobValidator),
  applyToJob
);

// GET /api/v1/jobs/:id/applications (Recruiter owner or Admin)
router.get(
  '/:id/applications',
  protect,
  restrictTo(ROLES.RECRUITER, ROLES.ADMIN),
  getJobApplications
);

module.exports = router;
