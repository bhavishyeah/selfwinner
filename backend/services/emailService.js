const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
  // Force Port 465 for Hostinger on Render
  port: 465, 
  secure: true, // True for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    // This helps prevent "Self Signed Certificate" errors
    rejectUnauthorized: false 
  }
});