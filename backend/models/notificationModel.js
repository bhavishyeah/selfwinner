const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    message: { type: String, required: true },
    audience: { type: String, default: 'all' },
    channel: { type: String, enum: ['in_app', 'email', 'both'], default: 'in_app' },
    scheduleAt: { type: Date, default: null },
    sentAt: { type: Date, default: null },
    status: { type: String, enum: ['scheduled', 'sent'], default: 'sent' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);