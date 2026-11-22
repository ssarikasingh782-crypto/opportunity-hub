const express = require('express');
const router = express.Router();

// Health routes
const healthRoutes = require('./health.routes');
router.use('/health', healthRoutes);

// Auth routes
const authRoutes = require('./auth.routes');
router.use('/auth', authRoutes);

// User routes (profile and admin user management)
const userRoutes = require('./user.routes');
router.use('/users', userRoutes);

// Company routes
const companyRoutes = require('./company.routes');
router.use('/companies', companyRoutes);

// Job routes (includes nested /:id/apply, /:id/save, /:id/applications)
const jobRoutes = require('./job.routes');
router.use('/jobs', jobRoutes);

// Application routes
const applicationRoutes = require('./application.routes');
router.use('/applications', applicationRoutes);

// Saved Jobs routes
const savedJobRoutes = require('./savedJob.routes');
router.use('/saved-jobs', savedJobRoutes);

// Dashboard stats route
const dashboardRoutes = require('./dashboard.routes');
router.use('/dashboard', dashboardRoutes);

module.exports = router;
