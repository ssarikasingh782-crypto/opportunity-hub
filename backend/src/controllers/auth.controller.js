const crypto = require('crypto');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { ROLES } = require('../config/constants');

/**
 * Helper to build auth response payload
 */
const buildAuthResponse = (user, token) => {
  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      resume: user.resume,
      skills: user.skills,
      education: user.education,
      bio: user.bio,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * @desc    Register a new candidate or recruiter
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('An account with this email address already exists.');
  }

  // Enforce role security: only candidate or recruiter allowed; never admin
  const assignedRole = role === ROLES.RECRUITER ? ROLES.RECRUITER : ROLES.CANDIDATE;

  const user = await User.create({
    name,
    email,
    password,
    role: assignedRole,
  });

  const token = generateToken(user._id, user.role);

  return ApiResponse.created(
    res,
    buildAuthResponse(user, token),
    'Registration successful'
  );
});

/**
 * @desc    Login existing user & return JWT
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Include password field explicitly since select: false in schema
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact support.');
  }

  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = generateToken(user._id, user.role);

  return ApiResponse.success(
    res,
    buildAuthResponse(user, token),
    'Login successful'
  );
});

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/v1/auth/me
 * @access  Private (Candidate, Recruiter, Admin)
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return ApiResponse.success(res, { user }, 'User profile retrieved successfully');
});

/**
 * @desc    Change password for authenticated user
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isCurrentPasswordCorrect = await user.matchPassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    throw ApiError.badRequest('Current password provided is incorrect');
  }

  user.password = newPassword;
  await user.save();

  const token = generateToken(user._id, user.role);

  return ApiResponse.success(
    res,
    { token },
    'Password changed successfully'
  );
});

/**
 * @desc    Send password reset token via email
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // For security, don't reveal user existence; return generic success message
    return ApiResponse.success(
      res,
      null,
      'If an account with that email exists, password reset instructions have been sent.'
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  const message = `You requested a password reset. Please click on the link below or paste it into your browser to reset your password:\n\n${resetUrl}\n\nThis link is valid for 10 minutes.\nIf you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Job Portal - Password Reset Request',
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your Job Portal account.</p>
          <p style="margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </p>
          <p>Or use this link: <a href="${resetUrl}">${resetUrl}</a></p>
          <p><small>This link expires in 10 minutes.</small></p>
        </div>
      `,
    });

    return ApiResponse.success(
      res,
      process.env.NODE_ENV === 'development' ? { resetToken } : null,
      'Password reset instructions sent to your email.'
    );
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw ApiError.internal('Email could not be sent. Please try again later.');
  }
});

/**
 * @desc    Reset password using reset token
 * @route   POST /api/v1/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash received token to compare with stored token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw ApiError.badRequest('Password reset token is invalid or has expired');
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const authToken = generateToken(user._id, user.role);

  return ApiResponse.success(
    res,
    buildAuthResponse(user, authToken),
    'Password has been reset successfully. You are now logged in.'
  );
});

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
};
