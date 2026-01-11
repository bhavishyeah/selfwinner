const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  college: {
    type: String,
    required: [true, 'College is required']
  },
  course: {
    type: String,
    required: [true, 'Course is required']
  },
  semester: {
    type: String,
    required: [true, 'Semester is required']
  },
  hobbies: {
    type: [String],
    default: []
  },
  language: {
    type: String,
    default: 'English'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer not to say'],
    default: 'prefer not to say'
  },
  personality: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);