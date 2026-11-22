const Job = require('../models/Job');
const Company = require('../models/Company');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES, JOB_STATUS } = require('../config/constants');

/**
 * @desc    Get all jobs (public listing with basic population)
 * @route   GET /api/v1/jobs
 * @access  Public
 */
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ status: JOB_STATUS.OPEN })
    .populate('company', 'name logo location website')
    .populate('postedBy', 'name email')
    .sort({ createdAt: -1 });

  return ApiResponse.success(res, { jobs }, 'Jobs retrieved successfully');
});

/**
 * @desc    Get single job by ID
 * @route   GET /api/v1/jobs/:id
 * @access  Public
 */
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('company', 'name description logo location website')
    .populate('postedBy', 'name email');

  if (!job) {
    throw ApiError.notFound('Job listing not found');
  }

  return ApiResponse.success(res, { job }, 'Job details retrieved successfully');
});

/**
 * @desc    Create a new job or internship
 * @route   POST /api/v1/jobs
 * @access  Private (Recruiter)
 */
const createJob = asyncHandler(async (req, res) => {
  // 1. Recruiter must have a registered company
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    throw ApiError.badRequest('You must create a company profile before posting jobs.');
  }

  const {
    title,
    description,
    type,
    workMode,
    location,
    salaryMin,
    salaryMax,
    skills,
    experienceLevel,
    deadline,
    openings,
  } = req.body;

  // Normalize skills
  let normalizedSkills = [];
  if (Array.isArray(skills)) {
    normalizedSkills = skills.map((s) => s.trim()).filter(Boolean);
  } else if (typeof skills === 'string') {
    normalizedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
  }

  const job = await Job.create({
    title,
    description,
    company: company._id,
    postedBy: req.user._id,
    type: type || undefined,
    workMode: workMode || undefined,
    location,
    salaryMin: salaryMin || 0,
    salaryMax: salaryMax || 0,
    skills: normalizedSkills,
    experienceLevel: experienceLevel || undefined,
    deadline: deadline || undefined,
    openings: openings || 1,
    status: JOB_STATUS.OPEN,
  });

  return ApiResponse.created(res, { job }, 'Job listing created successfully');
});

/**
 * @desc    Update a job listing
 * @route   PUT /api/v1/jobs/:id
 * @access  Private (Owner Recruiter or Admin)
 */
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw ApiError.notFound('Job listing not found');
  }

  // Ownership check
  const isOwner = job.postedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw ApiError.forbidden('You are not authorized to update this job listing');
  }

  const allowedFields = [
    'title',
    'description',
    'type',
    'workMode',
    'location',
    'salaryMin',
    'salaryMax',
    'skills',
    'experienceLevel',
    'deadline',
    'openings',
    'status',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === 'skills') {
        if (Array.isArray(req.body.skills)) {
          job.skills = req.body.skills.map((s) => s.trim()).filter(Boolean);
        } else if (typeof req.body.skills === 'string') {
          job.skills = req.body.skills.split(',').map((s) => s.trim()).filter(Boolean);
        }
      } else {
        job[field] = req.body[field];
      }
    }
  });

  await job.save();

  return ApiResponse.success(res, { job }, 'Job listing updated successfully');
});

/**
 * @desc    Delete (or remove) a job listing
 * @route   DELETE /api/v1/jobs/:id
 * @access  Private (Owner Recruiter or Admin)
 */
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw ApiError.notFound('Job listing not found');
  }

  const isOwner = job.postedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw ApiError.forbidden('You are not authorized to delete this job listing');
  }

  await Job.findByIdAndDelete(req.params.id);

  return ApiResponse.success(res, null, 'Job listing deleted successfully');
});

/**
 * @desc    Get jobs posted by the logged-in recruiter
 * @route   GET /api/v1/jobs/my
 * @access  Private (Recruiter)
 */
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id })
    .populate('company', 'name logo location')
    .sort({ createdAt: -1 });

  return ApiResponse.success(res, { jobs }, 'Your job listings retrieved successfully');
});

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
};
