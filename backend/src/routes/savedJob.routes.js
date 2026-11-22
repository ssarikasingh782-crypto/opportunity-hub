const express = require('express');
const router = express.Router();

const { getMySavedJobs } = require('../controllers/savedJob.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { ROLES } = require('../config/constants');

// Candidate saved jobs listing
router.get('/', protect, restrictTo(ROLES.CANDIDATE), getMySavedJobs);

module.exports = router;
