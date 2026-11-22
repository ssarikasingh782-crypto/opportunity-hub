const express = require('express');
const router = express.Router();

const {
  updateProfile,
  getAllUsers,
  updateUserStatus,
  deleteUser,
} = require('../controllers/user.controller');

const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { uploadProfileFiles } = require('../middlewares/upload.middleware');
const { ROLES } = require('../config/constants');

// Update profile with file upload (Protected for all logged-in roles)
router.put('/profile', protect, uploadProfileFiles, updateProfile);

// Admin-only user management routes
router.get('/', protect, restrictTo(ROLES.ADMIN), getAllUsers);
router.put('/:id/status', protect, restrictTo(ROLES.ADMIN), updateUserStatus);
router.delete('/:id', protect, restrictTo(ROLES.ADMIN), deleteUser);

module.exports = router;
