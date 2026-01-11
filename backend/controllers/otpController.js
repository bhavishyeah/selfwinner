const OTP = require('../models/otpModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send email using nodemailer
const sendEmailViaAPI = async (to, subject, html) => {
  try {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
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
  // ⚠️ REPLACE THESE IMAGE URLS WITH YOUR ACTUAL HOSTED IMAGES
  const IMAGE_BASE_URL = process.env.EMAIL_IMAGE_BASE_URL || 'https://yourdomain.com/email-assets';
  
  return `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <link href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,400;0,500" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css?family=DM+Sans:ital,wght@0,400;0,600;0,700;0,800" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css?family=Dela+Gothic+One:ital,wght@0,400" rel="stylesheet" />
  <title>SelfWinner - Verify Your Email</title>
  <style>
    html,body{margin:0!important;padding:0!important;min-height:100%!important;width:100%!important;-webkit-font-smoothing:antialiased}*{-ms-text-size-adjust:100%}table,td,th{mso-table-lspace:0!important;mso-table-rspace:0!important;border-collapse:collapse}img{border:0;outline:0;line-height:100%;text-decoration:none;-ms-interpolation-mode:bicubic}
    @media (max-width:620px){.pc-sm-hide{display:none!important}.pc-w620-padding-32-20-0-20{padding:32px 20px 0!important}.pc-w620-font-size-40px{font-size:40px!important}.pc-w620-padding-40-20-40-20{padding:40px 20px!important}.pc-w620-font-size-18px{font-size:18px!important}.pc-w620-fontSize-32px{font-size:32px!important}.pc-w620-padding-20-20-30-20{padding:20px 20px 30px!important}}
  </style>
</head>
<body class="body" style="width:100%!important;margin:0!important;padding:0!important;mso-line-height-rule:exactly;-webkit-font-smoothing:antialiased;-ms-text-size-adjust:100%;background-color:#f4f4f4">
  <table class="pc-project-body" align="center" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="table-layout:fixed">
    <tr>
      <td align="center" valign="top">
        <table width="600" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;margin:0 auto">
          <!-- HEADER SECTION -->
          <tr>
            <td valign="top" style="padding:32px 40px 0;background-color:#1679FF;border-radius:16px 16px 0 0">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" style="padding:0 0 30px">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td valign="top">
                          <!-- Logo - Replace with your actual logo URL -->
                          <img src="${IMAGE_BASE_URL}/logo.png" width="135" height="63" alt="SelfWinner" style="display:block;border:0;outline:0;line-height:100%;-ms-interpolation-mode:bicubic" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <div style="font-family:'Dela Gothic One',Arial,Helvetica,sans-serif;font-size:48px;line-height:100%;color:#ffffff;font-weight:400;text-align:center;margin:0">
                      Verify Your Email
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENT SECTION -->
          <tr>
            <td valign="top" style="padding:40px 40px;background-color:#ffffff">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center">
                    <div style="font-family:'DM Sans',Arial,Helvetica,sans-serif;font-size:20px;line-height:32px;color:#141414;font-weight:400;text-align:center">
                      Hey there! 👋<br><br>
                      We've received your signup request. To complete your registration at <strong style="font-weight:700">SelfWinner</strong>, please verify your email address using the code below:
                    </div>
                  </td>
                </tr>
                
                <!-- OTP BOX -->
                <tr>
                  <td align="center" style="padding:30px 0">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#1679FF;border-radius:12px;padding:24px 0">
                      <tr>
                        <td align="center" style="padding:0 40px">
                          <div style="font-family:'Dela Gothic One',Arial,Helvetica,sans-serif;font-size:48px;line-height:48px;color:#ffffff;font-weight:400;text-align:center;letter-spacing:8px">
                            ${otp}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center">
                    <div style="font-family:'DM Sans',Arial,Helvetica,sans-serif;font-size:18px;line-height:28px;color:#141414;font-weight:400;text-align:center">
                      This code will expire in <strong style="font-weight:700;color:#1679FF">10 minutes</strong>. Please enter it on the verification page to complete your signup.
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:30px 0 0">
                    <div style="font-family:'DM Sans',Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:#666666;font-weight:400;text-align:center">
                      If you didn't request this code, you can safely ignore this email. Someone might have typed your email address by mistake.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER SECTION -->
          <tr>
            <td valign="top" style="padding:36px 16px 16px;background-color:#141414;border-radius:0 0 16px 16px">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center">
                    <div style="font-family:'DM Sans',Arial,Helvetica,sans-serif;font-size:20px;line-height:28px;color:#ffffff;font-weight:700;text-align:center">
                      SelfWinner
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:8px 0">
                    <div style="font-family:'DM Sans',Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:#B8B8B8;font-weight:400;text-align:center">
                      Your trusted platform for academic excellence
                    </div>
                  </td>
                </tr>
                
                <!-- Social Icons (Optional - Replace with your actual social media icons) -->
                <tr>
                  <td align="center" style="padding:20px 0">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding:0 8px">
                          <a href="https://facebook.com/selfwinner" target="_blank">
                            <img src="${IMAGE_BASE_URL}/facebook-icon.png" width="18" height="18" alt="Facebook" style="display:block;border:0" />
                          </a>
                        </td>
                        <td style="padding:0 8px">
                          <a href="https://twitter.com/selfwinner" target="_blank">
                            <img src="${IMAGE_BASE_URL}/twitter-icon.png" width="18" height="18" alt="Twitter" style="display:block;border:0" />
                          </a>
                        </td>
                        <td style="padding:0 8px">
                          <a href="https://instagram.com/selfwinner" target="_blank">
                            <img src="${IMAGE_BASE_URL}/instagram-icon.png" width="18" height="18" alt="Instagram" style="display:block;border:0" />
                          </a>
                        </td>
                        <td style="padding:0 8px">
                          <a href="https://linkedin.com/company/selfwinner" target="_blank">
                            <img src="${IMAGE_BASE_URL}/linkedin-icon.png" width="18" height="18" alt="LinkedIn" style="display:block;border:0" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:20px 0 0">
                    <div style="font-family:'DM Sans',Arial,Helvetica,sans-serif;font-size:12px;line-height:16.8px;color:#B8B8B8;font-weight:400;text-align:center">
                      Want to change which emails you receive from us? You can 
                      <a href="${process.env.FRONTEND_URL}/preferences" style="color:#1679FF;text-decoration:underline">update your preferences</a> or 
                      <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#1679FF;text-decoration:underline">unsubscribe</a>.
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:20px 0 0">
                    <div style="font-family:'DM Sans',Arial,Helvetica,sans-serif;font-size:12px;line-height:16.8px;color:#666666;font-weight:400;text-align:center">
                      © ${new Date().getFullYear()} SelfWinner. All rights reserved.<br>
                      <a href="${process.env.FRONTEND_URL}/privacy" style="color:#1679FF;text-decoration:none">Privacy Policy</a> · 
                      <a href="${process.env.FRONTEND_URL}/terms" style="color:#1679FF;text-decoration:none">Terms of Service</a>
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
      await sendEmailViaAPI(email, '🔐 Verify Your SelfWinner Account', emailHTML);
      console.log('✅ OTP email sent successfully!\n');
      
      res.status(200).json({
        success: true,
        message: `OTP sent to ${email}! Check your inbox.`
      });
    } catch (emailError) {
      console.error('❌ Email failed:', emailError.message);
      console.log('💡 OTP (for testing):', otp, '\n');
      
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
      console.log('💡 OTP:', otp, '\n');
      res.status(500).json({ success: false, message: 'Failed to send', debug: otp });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;