const express = require('express');
const router = express.Router();

// Health routes
const healthRoutes = require('./health.routes');
router.use('/health', healthRoutes);

// Auth routes
const authRoutes = require('./auth.routes');
router.use('/auth', authRoutes);

// Company routes
const companyRoutes = require('./company.routes');
router.use('/companies', companyRoutes);

// Job routes (includes nested /:id/apply and /:id/applications)
const jobRoutes = require('./job.routes');
router.use('/jobs', jobRoutes);

// Application routes
const applicationRoutes = require('./application.routes');
router.use('/applications', applicationRoutes);

// Sub-routes for future phases:
// const userRoutes = require('./user.routes');
// const savedJobRoutes = require('./savedJob.routes');
// const dashboardRoutes = require('./dashboard.routes');

// router.use('/users', userRoutes);
// router.use('/saved-jobs', savedJobRoutes);
// router.use('/dashboard', dashboardRoutes);

module.exports = router;
