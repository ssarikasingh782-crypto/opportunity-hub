const Job = require('../models/Job');
const Company = require('../models/Company');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES, JOB_STATUS } = require('../config/constants');

/**
 * @desc    Get all jobs (public listing with pagination, text search, filtering, and sorting)
 * @route   GET /api/v1/jobs
 * @access  Public
 */
const getJobs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    type,
    workMode,
    location,
    skills,
    minSalary,
    sort = '-createdAt',
  } = req.query;

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (parsedPage - 1) * parsedLimit;

  // Build query filter
  const query = { status: JOB_STATUS.OPEN };

  // Full-text or regex search on title, description, skills
  if (search && search.trim()) {
    const trimmedSearch = search.trim();
    query.$or = [
      { title: { $regex: trimmedSearch, $options: 'i' } },
      { description: { $regex: trimmedSearch, $options: 'i' } },
      { skills: { $in: [new RegExp(trimmedSearch, 'i')] } },
    ];
  }

  // Type filter (job / internship)
  if (type) {
    query.type = type;
  }

  // Work Mode filter (onsite / remote / hybrid)
  if (workMode) {
    query.workMode = workMode;
  }

  // Location filter (case-insensitive substring)
  if (location && location.trim()) {
    query.location = { $regex: location.trim(), $options: 'i' };
  }

  // Minimum salary filter
  if (minSalary && !isNaN(minSalary)) {
    query.salaryMax = { $gte: Number(minSalary) };
  }

  // Skills filter (can be comma-separated)
  if (skills) {
    const skillList = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillList.length > 0) {
      query.skills = { $in: skillList.map((s) => new RegExp(`^${s}$`, 'i')) };
    }
  }

  // Build sorting
  let sortOption = {};
  if (sort === 'salary-desc') {
    sortOption = { salaryMax: -1 };
  } else if (sort === 'salary-asc') {
    sortOption = { salaryMin: 1 };
  } else if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else {
    // Default newest first
    sortOption = { createdAt: -1 };
  }

  const total = await Job.countDocuments(query);
  const jobs = await Job.find(query)
    .populate('company', 'name logo location website')
    .populate('postedBy', 'name email')
    .sort(sortOption)
    .skip(skip)
    .limit(parsedLimit);

  return ApiResponse.list(
    res,
    jobs,
    {
      page: parsedPage,
      limit: parsedLimit,
      total,
      pages: Math.ceil(total / parsedLimit) || 1,
    },
    'Jobs retrieved successfully'
  );
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
