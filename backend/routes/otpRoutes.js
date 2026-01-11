const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, resendOTP } = require('../controllers/otpController');

// Send OTP
router.post('/send', sendOTP);

// Verify OTP
router.post('/verify', verifyOTP);

// Resend OTP
router.post('/resend', resendOTP);

module.exports = router;