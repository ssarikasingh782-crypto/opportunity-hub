const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES } = require('../config/constants');

/**
 * @desc    Update current user profile (with avatar and resume upload)
 * @route   PUT /api/v1/users/profile
 * @access  Private (Candidate, Recruiter, Admin)
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const { name, bio, skills, education } = req.body;

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (education !== undefined) user.education = education;

  if (skills !== undefined) {
    if (Array.isArray(skills)) {
      user.skills = skills.map((s) => s.trim()).filter(Boolean);
    } else if (typeof skills === 'string') {
      user.skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  // Handle uploaded files (avatar / resume)
  if (req.files) {
    if (req.files.avatar && req.files.avatar[0]) {
      // Store public accessible URL path
      user.avatar = `/uploads/${req.files.avatar[0].filename}`;
    }
    if (req.files.resume && req.files.resume[0]) {
      user.resume = `/uploads/${req.files.resume[0].filename}`;
    }
  }

  await user.save();

  return ApiResponse.success(
    res,
    { user },
    'Profile updated successfully'
  );
});

/**
 * @desc    Get all users (Admin only) with pagination and filters
 * @route   GET /api/v1/users
 * @access  Private (Admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const query = {};

  // Search by name or email
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search.trim(), 'i');
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  // Role filter
  if (req.query.role && [ROLES.CANDIDATE, ROLES.RECRUITER, ROLES.ADMIN].includes(req.query.role)) {
    query.role = req.query.role;
  }

  // Status filter
  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return ApiResponse.list(
    res,
    users,
    {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
    'Users list retrieved successfully'
  );
});

/**
 * @desc    Activate or deactivate user account (Admin only)
 * @route   PUT /api/v1/users/:id/status
 * @access  Private (Admin)
 */
const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    throw ApiError.badRequest('Field isActive must be a boolean (true/false)');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Prevent admin from deactivating their own account
  if (user._id.toString() === req.user._id.toString()) {
    throw ApiError.badRequest('You cannot deactivate your own administrative account');
  }

  user.isActive = isActive;
  await user.save();

  return ApiResponse.success(
    res,
    { user },
    `User account has been ${isActive ? 'activated' : 'deactivated'} successfully`
  );
});

/**
 * @desc    Delete user account (Admin only)
 * @route   DELETE /api/v1/users/:id
 * @access  Private (Admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw ApiError.badRequest('You cannot delete your own administrative account');
  }

  await User.findByIdAndDelete(req.params.id);

  return ApiResponse.success(res, null, 'User deleted successfully');
});

module.exports = {
  updateProfile,
  getAllUsers,
  updateUserStatus,
  deleteUser,
};
