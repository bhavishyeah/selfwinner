const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
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
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  pdfPath: {
    type: String,
    required: [true, 'PDF file is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
noteSchema.index({ college: 1, course: 1, semester: 1, subject: 1 });
noteSchema.index({ status: 1 });
noteSchema.index({ price: 1 });

module.exports = mongoose.model('Note', noteSchema);