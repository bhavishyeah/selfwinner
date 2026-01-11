const express = require('express');
const router = express.Router();
const {
  viewNote,
  getAccessibleNotes
} = require('../controllers/viewerController');
const { protect } = require('../middleware/authMiddleware');

// View note PDF (token in query parameter)
router.get('/note/:id', viewNote);

// Get accessible notes for user
router.get('/accessible-notes', protect, getAccessibleNotes);

module.exports = router;