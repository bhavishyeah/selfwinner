const OTP = require('../models/otpModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); // Import here to be safe

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send email using nodemailer (FIXED TYPO & PORTS)
const sendEmailViaAPI = async (to, subject, html) => {
  try {
    // ✅ FIX 1: createTransport (not createTransporter)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
      // ✅ FIX 2: Force Port 465 for Hostinger on Cloud Servers
      port: 465,
      secure: true, // Must be true for 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Make sure .env uses EMAIL_PASSWORD (not EMAIL_PASS)
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: to,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER,
      subject: subject,
      html: html
    });

    return true;
  } catch (error) {
    console.error('Email API Error:', error.message);
    throw error;
  }
};

// Get custom email template with OTP
const getOTPEmailTemplate = (otp, email) => {
  // Use frontend URL for assets if image base url is missing
  const IMAGE_BASE_URL = process.env.EMAIL_IMAGE_BASE_URL || process.env.FRONTEND_URL || 'https://selfwinner.com';
  
  return `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SelfWinner - Verify Your Email</title>
  <style>
    html,body{margin:0!important;padding:0!important;min-height:100%!important;width:100%!important;-webkit-font-smoothing:antialiased}
  </style>
</head>
<body class="body" style="width:100%!important;margin:0!important;padding:0!important;background-color:#f4f4f4">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed">
    <tr>
      <td align="center" valign="top">
        <table width="600" align="center" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;margin:0 auto">
          <tr>
            <td valign="top" style="padding:32px 40px 0;background-color:#1679FF;border-radius:16px 16px 0 0">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="font-family:Arial,sans-serif;font-size:32px;color:#ffffff;font-weight:bold;">
                      SelfWinner
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:20px 0">
                    <div style="font-family:Arial,sans-serif;font-size:48px;color:#ffffff;font-weight:bold;">
                      Verify Your Email
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td valign="top" style="padding:40px 40px;background-color:#ffffff">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="font-family:Arial,sans-serif;font-size:20px;line-height:32px;color:#141414;">
                      Hey there! 👋<br><br>
                      To complete your registration at <strong>SelfWinner</strong>, please verify your email using the code below:
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td align="center" style="padding:30px 0">
                    <table border="0" cellpadding="0" cellspacing="0" style="background-color:#1679FF;border-radius:12px;padding:24px 40px">
                      <tr>
                        <td align="center">
                          <div style="font-family:monospace;font-size:48px;color:#ffffff;font-weight:bold;letter-spacing:8px">
                            ${otp}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center">
                    <div style="font-family:Arial,sans-serif;font-size:16px;color:#666666;">
                      This code will expire in 10 minutes.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td valign="top" style="padding:36px 16px;background-color:#141414;border-radius:0 0 16px 16px">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="font-family:Arial,sans-serif;font-size:20px;color:#ffffff;font-weight:bold">
                      SelfWinner
                    </div>
                    <div style="font-family:Arial,sans-serif;font-size:14px;color:#B8B8B8;margin-top:10px">
                      Your trusted platform for academic excellence
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

// SEND OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    console.log('\n📧 OTP Request for:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists. Please login.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();
    
    console.log('🔢 Generated OTP:', otp);

    await OTP.deleteMany({ email: email.toLowerCase() });
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      password: hashedPassword,
      name: name || email.split('@')[0]
    });

    console.log('✅ OTP saved to database');

    // Get custom email template
    const emailHTML = getOTPEmailTemplate(otp, email);

    try {
      // Use the internal function
      await sendEmailViaAPI(email, '🔐 Verify Your SelfWinner Account', emailHTML);
      console.log('✅ OTP email sent successfully!\n');
      
      res.status(200).json({
        success: true,
        message: `OTP sent to ${email}! Check your inbox.`
      });
    } catch (emailError) {
      console.error('❌ Email failed:', emailError.message);
      // Fallback for debugging
      res.status(500).json({
        success: false,
        message: 'Failed to send email. Please try again.',
        debug: otp
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed: ' + error.message
    });
  }
};

// VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log('\n🔍 Verifying OTP for:', email);

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP required' });
    }

    const otpRecord = await OTP.findOne({ 
      email: email.toLowerCase(),
      otp: otp.trim()
    });

    if (!otpRecord) {
      console.log('❌ Invalid OTP\n');
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    console.log('✅ OTP verified');

    const user = await User.create({
      email: email.toLowerCase(),
      password: otpRecord.password,
      name: otpRecord.name,
      role: 'student',
      isActive: true
    });

    console.log('✅ User created:', user.email);
    await OTP.deleteOne({ _id: otpRecord._id });

    const token = user.generateAuthToken();
    console.log('✅ Success!\n');

    res.status(201).json({
      success: true,
      message: 'Account created! 🎉',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// RESEND OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    console.log('\n🔄 Resending OTP to:', email);

    const existingOTP = await OTP.findOne({ email: email.toLowerCase() });
    if (!existingOTP) {
      return res.status(404).json({ success: false, message: 'No pending request' });
    }

    const otp = generateOTP();
    console.log('🔢 New OTP:', otp);

    existingOTP.otp = otp;
    existingOTP.createdAt = Date.now();
    await existingOTP.save();

    const emailHTML = getOTPEmailTemplate(otp, email);

    try {
      await sendEmailViaAPI(email, '🔐 Your New Verification Code', emailHTML);
      console.log('✅ OTP resent!\n');
      res.status(200).json({ success: true, message: 'New OTP sent!' });
    } catch (emailError) {
      console.error('❌ Email failed:', emailError.message);
      res.status(500).json({ success: false, message: 'Failed to send', debug: otp });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;