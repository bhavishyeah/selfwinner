const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['note', 'bundle'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemType'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  signature: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster access checks
purchaseSchema.index({ userId: 1, itemId: 1, itemType: 1 });
purchaseSchema.index({ userId: 1, status: 1 });

// Static method to check if user has purchased
purchaseSchema.statics.hasAccess = async function(userId, itemId, itemType) {
  const purchase = await this.findOne({
    userId,
    itemId,
    itemType,
    status: 'completed'
  });
  return !!purchase;
};

module.exports = mongoose.model('Purchase', purchaseSchema);