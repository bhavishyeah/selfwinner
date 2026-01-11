const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  createOrUpdateProfile,
  deleteProfile
} = require('../controllers/profileController');

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', protect, getProfile);

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', protect, createOrUpdateProfile);

// @route   DELETE /api/profile
// @desc    Delete user profile
// @access  Private
router.delete('/', protect, deleteProfile);

module.exports = router;