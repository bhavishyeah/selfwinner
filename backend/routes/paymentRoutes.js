const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  verifyPayment,
  getUserPurchases,
  checkAccess
} = require('../controllers/paymentController');

// Create payment order
router.post('/create-order', protect, createOrder);

// Verify payment
router.post('/verify', protect, verifyPayment);

// Get user purchases
router.get('/purchases', protect, getUserPurchases);

// Check access to item
router.get('/check-access/:itemType/:itemId', protect, checkAccess);

module.exports = router;