const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ JWT_SECRET is missing. Using temporary development secret.');
    return 'selfwinner_dev_jwt_secret_change_me';
  }

  throw new Error('JWT_SECRET is not configured');
};

const userSchema = new mongoose.Schema({
  isActive: {
  type: Boolean,
  default: true  // ✅ Active by default
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  // Google OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows null values to be non-unique
  },
  profilePicture: {
    type: String
  },
  // Profile fields
  college: String,
  course: String,
  semester: String,
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving (only if modified)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  // Don't hash if it's already a Google auth placeholder
  if (this.password.startsWith('google-auth-')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Google auth users don't have real passwords
  if (this.password.startsWith('google-auth-')) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      userId: this._id,
      email: this.email,
      role: this.role
    },
    getJwtSecret(),  
      { expiresIn: '7d' }
  );
};

module.exports = mongoose.model('User', userSchema);