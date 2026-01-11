const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { uploadSingle, handleUploadError } = require('../middleware/uploadMiddleware');
const {
  getAllNotes,
  getNote,
  uploadNote,
  updateNote,
  deleteNote,
  checkAccess
} = require('../controllers/noteController');

// @route   GET /api/notes
// @desc    Get all notes with filters
// @access  Public (with optional auth for access status)
router.get('/', optionalAuth, getAllNotes);

// @route   GET /api/notes/:id
// @desc    Get single note
// @access  Public (with optional auth for access status)
router.get('/:id', optionalAuth, getNote);

// @route   POST /api/notes
// @desc    Upload new note
// @access  Private (Admin only)
router.post('/', protect, admin, uploadSingle, handleUploadError, uploadNote);

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private (Admin only)
router.put('/:id', protect, admin, updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private (Admin only)
router.delete('/:id', protect, admin, deleteNote);

// @route   GET /api/notes/:id/access
// @desc    Check user access to note
// @access  Private
router.get('/:id/access', protect, checkAccess);

module.exports = router;