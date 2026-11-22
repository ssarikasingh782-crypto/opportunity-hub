const Application = require('../models/Application');
const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES, JOB_STATUS } = require('../config/constants');

/**
 * @desc    Apply to a job listing
 * @route   POST /api/v1/jobs/:id/apply
 * @access  Private (Candidate)
 */
const applyToJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const candidateId = req.user._id;

  // 1. Verify Job exists and is open
  const job = await Job.findById(jobId);
  if (!job) {
    throw ApiError.notFound('Job listing not found');
  }

  if (job.status !== JOB_STATUS.OPEN) {
    throw ApiError.badRequest('This job listing is no longer accepting applications.');
  }

  // 2. Prevent candidate from applying to the same job twice
  const existingApplication = await Application.findOne({
    job: jobId,
    candidate: candidateId,
  });

  if (existingApplication) {
    throw ApiError.conflict('You have already submitted an application for this position.');
  }

  const { coverLetter, resumeUrl } = req.body;

  // Fallback to user profile resume if not explicitly sent
  const finalResumeUrl = resumeUrl || req.user.resume || '';

  const application = await Application.create({
    job: jobId,
    candidate: candidateId,
    coverLetter: coverLetter || '',
    resumeUrl: finalResumeUrl,
  });

  return ApiResponse.created(
    res,
    { application },
    'Your application has been submitted successfully'
  );
});

/**
 * @desc    Get all applications submitted by logged-in candidate
 * @route   GET /api/v1/applications/my
 * @access  Private (Candidate)
 */
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate({
      path: 'job',
      select: 'title type workMode location salaryMin salaryMax company status',
      populate: {
        path: 'company',
        select: 'name logo location',
      },
    })
    .sort({ appliedAt: -1 });

  return ApiResponse.success(
    res,
    { applications },
    'Your applications retrieved successfully'
  );
});

/**
 * @desc    Get all applicants for a specific job (Recruiter owner or Admin)
 * @route   GET /api/v1/jobs/:id/applications
 * @access  Private (Recruiter owner, Admin)
 */
const getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw ApiError.notFound('Job listing not found');
  }

  // Ownership check: only the recruiter who posted the job or an admin can see applicants
  const isOwner = job.postedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw ApiError.forbidden('You are not authorized to view applicants for this job');
  }

  const applications = await Application.find({ job: req.params.id })
    .populate('candidate', 'name email avatar skills education bio resume')
    .sort({ appliedAt: -1 });

  return ApiResponse.success(
    res,
    { applications, total: applications.length },
    'Job applicants retrieved successfully'
  );
});

/**
 * @desc    Update applicant status (applied, shortlisted, rejected, hired)
 * @route   PUT /api/v1/applications/:id/status
 * @access  Private (Recruiter owner of the job, Admin)
 */
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const application = await Application.findById(req.params.id).populate('job');
  if (!application) {
    throw ApiError.notFound('Application not found');
  }

  // Ownership check: must be owner of the job being applied to
  const isOwner = application.job.postedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw ApiError.forbidden('You are not authorized to update this application status');
  }

  application.status = status;
  await application.save();

  return ApiResponse.success(
    res,
    { application },
    `Application status updated to '${status}' successfully`
  );
});

/**
 * @desc    Withdraw application (Candidate only)
 * @route   DELETE /api/v1/applications/:id
 * @access  Private (Candidate)
 */
const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    throw ApiError.notFound('Application not found');
  }

  // Only the candidate who applied can withdraw
  if (application.candidate.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You can only withdraw your own applications');
  }

  await Application.findByIdAndDelete(req.params.id);

  return ApiResponse.success(res, null, 'Application withdrawn successfully');
});

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
};
