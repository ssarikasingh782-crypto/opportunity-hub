const express = require('express');
const router = express.Router();

const { getDashboardStats } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');

// All authenticated roles can fetch their role-specific dashboard metrics
router.get('/stats', protect, getDashboardStats);

module.exports = router;
