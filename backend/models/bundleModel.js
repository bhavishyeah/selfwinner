const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Bundle title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Bundle description is required']
  },
  price: {
    type: Number,
    required: [true, 'Bundle price is required'],
    min: [0, 'Price cannot be negative']
  },
  noteIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  college: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Calculate total value of notes in bundle
bundleSchema.virtual('totalValue').get(function() {
  // This would require populating notes first
  return this.noteIds.length;
});

module.exports = mongoose.model('Bundle', bundleSchema);