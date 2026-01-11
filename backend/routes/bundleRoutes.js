const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const {
  getAllBundles,
  getBundle,
  createBundle,
  updateBundle,
  deleteBundle,
  addNoteToBundle,
  removeNoteFromBundle
} = require('../controllers/bundleController');

// @route   GET /api/bundles
// @desc    Get all bundles
// @access  Public (with optional auth for access status)
router.get('/', optionalAuth, getAllBundles);

// @route   GET /api/bundles/:id
// @desc    Get single bundle
// @access  Public (with optional auth for access status)
router.get('/:id', optionalAuth, getBundle);

// @route   POST /api/bundles
// @desc    Create new bundle
// @access  Private (Admin only)
router.post('/', protect, admin, createBundle);

// @route   PUT /api/bundles/:id
// @desc    Update bundle
// @access  Private (Admin only)
router.put('/:id', protect, admin, updateBundle);

// @route   DELETE /api/bundles/:id
// @desc    Delete bundle
// @access  Private (Admin only)
router.delete('/:id', protect, admin, deleteBundle);

// @route   POST /api/bundles/:id/notes
// @desc    Add note to bundle
// @access  Private (Admin only)
router.post('/:id/notes', protect, admin, addNoteToBundle);

// @route   DELETE /api/bundles/:id/notes/:noteId
// @desc    Remove note from bundle
// @access  Private (Admin only)
router.delete('/:id/notes/:noteId', protect, admin, removeNoteFromBundle);

module.exports = router;