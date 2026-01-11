const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');



// Load env vars
dotenv.config({ path: '../.env' });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const noteRoutes = require('./routes/noteRoutes');
const bundleRoutes = require('./routes/bundleRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const viewerRoutes = require('./routes/viewerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const otpRoutes = require('./routes/otpRoutes');              // ← ADD HERE
const googleAuthRoutes = require('./routes/googleAuthRoutes'); 
// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/viewer', viewerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/otp', otpRoutes); 
app.use('/api/auth/google', googleAuthRoutes);
// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SelfWinner API is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SelfWinner API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      notes: '/api/notes',
      bundles: '/api/bundles',
      payments: '/api/payments',
      viewer: '/api/viewer',
      admin: '/api/admin',
      health: '/api/health'
    }
  });
});
// Then use routes:


// 404 handler - Must be AFTER all routes
app.use(notFound);

// Error handling middleware - Must be LAST
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

module.exports = app;