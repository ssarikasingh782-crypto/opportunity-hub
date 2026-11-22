const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const SavedJob = require('../models/SavedJob');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES, JOB_STATUS } = require('../config/constants');

/**
 * @desc    Get role-aware dashboard analytics
 * @route   GET /api/v1/dashboard/stats
 * @access  Private (Candidate, Recruiter, Admin)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const { role, _id: userId } = req.user;

  // 1. CANDIDATE DASHBOARD STATS
  if (role === ROLES.CANDIDATE) {
    const totalApplications = await Application.countDocuments({ candidate: userId });
    const totalSavedJobs = await SavedJob.countDocuments({ user: userId });

    // Applications grouped by status using MongoDB aggregation
    const statusCounts = await Application.aggregate([
      { $match: { candidate: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusMap = {
      applied: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    };
    statusCounts.forEach((item) => {
      if (statusMap[item._id] !== undefined) {
        statusMap[item._id] = item.count;
      }
    });

    // Recent 5 applications
    const recentApplications = await Application.find({ candidate: userId })
      .populate({
        path: 'job',
        select: 'title type location company',
        populate: { path: 'company', select: 'name logo' },
      })
      .sort({ appliedAt: -1 })
      .limit(5);

    return ApiResponse.success(
      res,
      {
        totalApplications,
        totalSavedJobs,
        byStatus: statusMap,
        recentApplications,
      },
      'Candidate dashboard statistics retrieved'
    );
  }

  // 2. RECRUITER DASHBOARD STATS
  if (role === ROLES.RECRUITER) {
    const totalJobs = await Job.countDocuments({ postedBy: userId });
    const activeJobs = await Job.countDocuments({
      postedBy: userId,
      status: JOB_STATUS.OPEN,
    });

    // Get all job IDs posted by recruiter
    const recruiterJobs = await Job.find({ postedBy: userId }).select('_id');
    const jobIds = recruiterJobs.map((j) => j._id);

    // Aggregate applicants count and status grouping for recruiter's jobs
    const applicantStats = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const applicantStatusMap = {
      applied: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    };
    let totalApplicants = 0;

    applicantStats.forEach((item) => {
      if (applicantStatusMap[item._id] !== undefined) {
        applicantStatusMap[item._id] = item.count;
      }
      totalApplicants += item.count;
    });

    // Recent 5 applicants
    const recentApplicants = await Application.find({ job: { $in: jobIds } })
      .populate('candidate', 'name email avatar skills')
      .populate('job', 'title')
      .sort({ appliedAt: -1 })
      .limit(5);

    return ApiResponse.success(
      res,
      {
        totalJobs,
        activeJobs,
        totalApplicants,
        byStatus: applicantStatusMap,
        recentApplicants,
      },
      'Recruiter dashboard statistics retrieved'
    );
  }

  // 3. ADMIN DASHBOARD STATS (Platform-wide metrics with Monthly Aggregations)
  if (role === ROLES.ADMIN) {
    const totalCandidates = await User.countDocuments({ role: ROLES.CANDIDATE });
    const totalRecruiters = await User.countDocuments({ role: ROLES.RECRUITER });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: JOB_STATUS.OPEN });
    const totalApplications = await Application.countDocuments();

    // Aggregation: Jobs created per month (past 6 months) for Chart.js
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyJobsAggregation = await Job.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Aggregation: Applications per month for Chart.js
    const monthlyApplicationsAggregation = await Application.aggregate([
      { $match: { appliedAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$appliedAt' },
            month: { $month: '$appliedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return ApiResponse.success(
      res,
      {
        users: {
          candidates: totalCandidates,
          recruiters: totalRecruiters,
          total: totalCandidates + totalRecruiters + 1,
        },
        companies: totalCompanies,
        jobs: {
          total: totalJobs,
          active: activeJobs,
        },
        applications: {
          total: totalApplications,
        },
        monthlyTrends: {
          jobs: monthlyJobsAggregation,
          applications: monthlyApplicationsAggregation,
        },
      },
      'Admin platform analytics retrieved'
    );
  }
});

module.exports = {
  getDashboardStats,
};
