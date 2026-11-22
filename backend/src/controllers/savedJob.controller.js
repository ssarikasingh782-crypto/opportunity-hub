const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Save a job listing to candidate favorites
 * @route   POST /api/v1/jobs/:id/save
 * @access  Private (Candidate)
 */
const saveJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  const job = await Job.findById(jobId);
  if (!job) {
    throw ApiError.notFound('Job listing not found');
  }

  // Check if already saved
  const existingSaved = await SavedJob.findOne({
    user: req.user._id,
    job: jobId,
  });

  if (existingSaved) {
    return ApiResponse.success(res, { savedJob: existingSaved }, 'Job is already saved');
  }

  const savedJob = await SavedJob.create({
    user: req.user._id,
    job: jobId,
  });

  return ApiResponse.created(res, { savedJob }, 'Job saved successfully to your favorites');
});

/**
 * @desc    Remove job from saved list
 * @route   DELETE /api/v1/jobs/:id/save
 * @access  Private (Candidate)
 */
const unsaveJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  const result = await SavedJob.findOneAndDelete({
    user: req.user._id,
    job: jobId,
  });

  if (!result) {
    throw ApiError.notFound('Saved job record not found');
  }

  return ApiResponse.success(res, null, 'Job removed from saved listings');
});

/**
 * @desc    Get all saved jobs for logged-in candidate
 * @route   GET /api/v1/saved-jobs
 * @access  Private (Candidate)
 */
const getMySavedJobs = asyncHandler(async (req, res) => {
  const savedJobs = await SavedJob.find({ user: req.user._id })
    .populate({
      path: 'job',
      populate: {
        path: 'company',
        select: 'name logo location website',
      },
    })
    .sort({ createdAt: -1 });

  return ApiResponse.success(res, { savedJobs }, 'Saved jobs retrieved successfully');
});

module.exports = {
  saveJob,
  unsaveJob,
  getMySavedJobs,
};
