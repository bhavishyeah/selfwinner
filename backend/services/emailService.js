const nodemailer = require('nodemailer');

// Hostinger SMTP Configuration
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false, // For development
    minVersion: 'TLSv1.2'
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error.message);
    console.error('   Check EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD in .env');
    console.error('   Host:', process.env.EMAIL_HOST);
    console.error('   Port:', process.env.EMAIL_PORT);
    console.error('   User:', process.env.EMAIL_USER);
  } else {
    console.log('✅ Email service ready - Hostinger SMTP connected');
    console.log('   Host:', process.env.EMAIL_HOST);
    console.log('   Port:', process.env.EMAIL_PORT);
    console.log('   From:', process.env.EMAIL_USER);
  }
});

// Send OTP email
exports.sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: '🔐 Your SelfWinner Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333;
            background-color: #f5f5f5;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: #f5f5f5;
            padding: 20px;
          }
          .email-container { 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .email-header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .email-header h1 { 
            color: white; 
            margin: 0; 
            font-size: 28px;
            font-weight: 600;
          }
          .email-body { 
            padding: 40px 30px;
          }
          .email-body h2 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .otp-container { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-label {
            color: rgba(255,255,255,0.9);
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
          }
          .otp-code { 
            font-size: 48px;
            font-weight: bold;
            color: white;
            letter-spacing: 12px;
            font-family: 'Courier New', monospace;
          }
          .warning-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px 20px;
            margin: 25px 0;
            border-radius: 4px;
          }
          .warning-box p {
            color: #856404;
            margin: 0;
            font-weight: 500;
          }
          .info-text {
            color: #666;
            font-size: 15px;
            line-height: 1.6;
            margin: 15px 0;
          }
          .email-footer { 
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          .email-footer p { 
            margin: 8px 0;
            font-size: 13px;
            color: #6c757d;
          }
          .divider {
            height: 1px;
            background: #e9ecef;
            margin: 30px 0;
          }
          a {
            color: #667eea;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="email-header">
              <h1>🎓 SelfWinner</h1>
            </div>
            
            <div class="email-body">
              <h2>Verify Your Email Address</h2>
              
              <p class="info-text">
                Hello! Welcome to <strong>SelfWinner</strong>. To complete your registration and secure your account, please use the verification code below:
              </p>
              
              <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${otp}</div>
              </div>
              
              <div class="warning-box">
                <p>⏰ This code will expire in 10 minutes</p>
              </div>
              
              <p class="info-text">
                Enter this code on the verification page to activate your account and start accessing premium study materials.
              </p>
              
              <div class="divider"></div>
              
              <p class="info-text" style="font-size: 13px; color: #999;">
                If you didn't request this code, please ignore this email. Your account will not be created without verification.
              </p>
            </div>
            
            <div class="email-footer">
              <p><strong>© ${new Date().getFullYear()} SelfWinner</strong></p>
              <p>Your trusted platform for academic excellence</p>
              <p style="margin-top: 15px;">
                Need help? Contact us at <a href="mailto:support@selfwinner.com">support@selfwinner.com</a>
              </p>
              <p style="font-size: 11px; color: #adb5bd; margin-top: 15px;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
SelfWinner - Email Verification

Your verification code is: ${otp}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} SelfWinner
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully');
    console.log('   To:', email);
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send OTP email');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    throw error;
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: '🎉 Welcome to SelfWinner!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea, #764ba2); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 32px; }
          .content { padding: 40px 30px; }
          .feature { margin: 15px 0; padding-left: 30px; position: relative; }
          .feature:before { content: "✓"; position: absolute; left: 0; color: #667eea; font-weight: bold; font-size: 20px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 25px 0; }
          .footer { background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e9ecef; }
          .footer p { margin: 5px 0; font-size: 13px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to SelfWinner!</h1>
          </div>
          <div class="content">
            <h2 style="color: #333;">Hi ${name || 'there'}! 👋</h2>
            <p>Your account has been successfully created! We're thrilled to have you join our community of dedicated learners.</p>
            
            <h3 style="color: #667eea; margin-top: 30px;">What you can do now:</h3>
            
            <div class="feature">Browse thousands of premium study notes</div>
            <div class="feature">Get exclusive bundle deals</div>
            <div class="feature">Access materials anytime, anywhere</div>
            <div class="feature">Join a community of top students</div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/notes" class="cta-button">
                Start Exploring Notes
              </a>
            </div>
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; font-size: 14px;">
              Need help? We're here for you at <a href="mailto:support@selfwinner.com" style="color: #667eea;">support@selfwinner.com</a>
            </p>
            
            <p style="margin-top: 20px;"><strong>Happy Learning! 📚</strong><br>The SelfWinner Team</p>
          </div>
          <div class="footer">
            <p><strong>© ${new Date().getFullYear()} SelfWinner</strong></p>
            <p>Your trusted platform for academic excellence</p>
            <p style="margin-top: 10px; font-size: 12px;">This email was sent to ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
    return true;
  } catch (error) {
    console.error('⚠️  Warning: Welcome email failed:', error.message);
    return false;
  }
};

module.exports = exports;