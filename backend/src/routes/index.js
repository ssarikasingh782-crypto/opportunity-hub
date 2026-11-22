const express = require('express');
const router = express.Router();

// Health routes
const healthRoutes = require('./health.routes');
router.use('/health', healthRoutes);

// Sub-routes for future phases will be mounted here:
// const authRoutes = require('./auth.routes');
// const userRoutes = require('./user.routes');
// const companyRoutes = require('./company.routes');
// const jobRoutes = require('./job.routes');
// const applicationRoutes = require('./application.routes');
// const savedJobRoutes = require('./savedJob.routes');
// const dashboardRoutes = require('./dashboard.routes');

// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/companies', companyRoutes);
// router.use('/jobs', jobRoutes);
// router.use('/applications', applicationRoutes);
// router.use('/saved-jobs', savedJobRoutes);
// router.use('/dashboard', dashboardRoutes);

module.exports = router;
