const Razorpay = require('razorpay');
const crypto = require('crypto');
const Purchase = require('../models/purchaseModel');
const Note = require('../models/noteModel');
const Bundle = require('../models/bundleModel');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SWgTWoVbyiBId5',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'KZg6RO2qHRiSz21C638oy7lg'
});

console.log('✅ Razorpay initialized with key:', process.env.RAZORPAY_KEY_ID);

// Create payment order
exports.createOrder = async (req, res) => {
  try {
    console.log('📥 Create order request:', req.body);
    const { itemType, itemId } = req.body;
    const userId = req.user.id;

    console.log('User ID:', userId);
    console.log('Item Type:', itemType);
    console.log('Item ID:', itemId);

    if (!itemType || !itemId) {
      console.log('❌ Missing itemType or itemId');
      return res.status(400).json({
        success: false,
        message: 'Item type and ID are required'
      });
    }

    let item;
    let itemTitle;
    let amount;

    // Get item based on type
    if (itemType === 'note') {
      console.log('🔍 Finding note:', itemId);
      item = await Note.findById(itemId);
      console.log('Found note:', item);
      
      if (!item) {
        console.log('❌ Note not found');
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }
      itemTitle = item.title;
      amount = item.price;
    } else if (itemType === 'bundle') {
      console.log('🔍 Finding bundle:', itemId);
      item = await Bundle.findById(itemId);
      console.log('Found bundle:', item);
      
      if (!item) {
        console.log('❌ Bundle not found');
        return res.status(404).json({
          success: false,
          message: 'Bundle not found'
        });
      }
      itemTitle = item.title;
      amount = item.price;
    } else {
      console.log('❌ Invalid item type:', itemType);
      return res.status(400).json({
        success: false,
        message: 'Invalid item type. Must be "note" or "bundle"'
      });
    }

    console.log('Item title:', itemTitle);
    console.log('Item price:', amount);

    // Check if amount is valid
    if (!amount || amount <= 0) {
      console.log('❌ Invalid amount:', amount);
      return res.status(400).json({
        success: false,
        message: 'Item price must be greater than 0'
      });
    }

    // Create Razorpay order
    const amountInPaise = Math.round(amount * 100);
    console.log('💰 Amount in paise:', amountInPaise);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId,
        itemType,
        itemId,
        itemTitle
      }
    };

    console.log('📤 Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', order);

    const response = {
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        itemType,
        itemId,
        itemTitle
      }
    };

    console.log('📤 Sending response:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Create order error:', error);
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error
    });
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order',
      error: error.error || error.toString()
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    console.log('📥 Verify payment request:', req.body);
    const { orderId, paymentId, signature, itemType, itemId, amount } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !signature) {
      console.log('❌ Missing payment details');
      return res.status(400).json({
        success: false,
        message: 'Missing payment details'
      });
    }

    // Verify signature
    const text = orderId + '|' + paymentId;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(text)
      .digest('hex');

    console.log('🔐 Signature verification:');
    console.log('Received:', signature);
    console.log('Generated:', generatedSignature);

    if (generatedSignature !== signature) {
      console.log('❌ Invalid signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    console.log('✅ Signature verified');

    // Check if purchase already exists
    const existingPurchase = await Purchase.findOne({
      userId,
      orderId
    });

    if (existingPurchase) {
      console.log('⚠️ Purchase already exists:', existingPurchase._id);
      return res.status(200).json({
        success: true,
        message: 'Purchase already recorded',
        purchase: existingPurchase
      });
    }

    // Create purchase record
    console.log('💾 Creating purchase record...');
    const purchase = await Purchase.create({
      userId,
      itemType,
      itemId,
      amount: amount / 100,
      paymentId,
      orderId,
      signature,
      status: 'completed'
    });

    console.log('✅ Purchase created:', purchase._id);

    // Update item purchase count
    if (itemType === 'note') {
      await Note.findByIdAndUpdate(itemId, {
        $inc: { purchases: 1 }
      });
      console.log('✅ Note purchase count updated');
    } else if (itemType === 'bundle') {
      await Bundle.findByIdAndUpdate(itemId, {
        $inc: { purchases: 1 }
      });
      console.log('✅ Bundle purchase count updated');
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      purchase
    });
  } catch (error) {
    console.error('❌ Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
};

// Get user purchases
exports.getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📥 Get purchases for user:', userId);

    const purchases = await Purchase.find({ userId })
      .populate('itemId')
      .sort({ createdAt: -1 });

    console.log('✅ Found purchases:', purchases.length);

    res.status(200).json({
      success: true,
      purchases
    });
  } catch (error) {
    console.error('❌ Get purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get purchases'
    });
  }
};

// Check access to item
exports.checkAccess = async (req, res) => {
  try {
    const { itemType, itemId } = req.params;
    const userId = req.user.id;

    console.log('🔍 Check access:', { userId, itemType, itemId });

    // Check if it's a free item
    let item;
    if (itemType === 'note') {
      item = await Note.findById(itemId);
      if (item && item.price === 0) {
        console.log('✅ Free note - access granted');
        return res.status(200).json({
          success: true,
          hasAccess: true
        });
      }
    } else if (itemType === 'bundle') {
      item = await Bundle.findById(itemId);
      if (item && item.price === 0) {
        console.log('✅ Free bundle - access granted');
        return res.status(200).json({
          success: true,
          hasAccess: true
        });
      }
    }

    // Check if user has purchased
    const purchase = await Purchase.findOne({
      userId,
      itemType,
      itemId,
      status: 'completed'
    });

    console.log('Purchase found:', !!purchase);

    res.status(200).json({
      success: true,
      hasAccess: !!purchase
    });
  } catch (error) {
    console.error('❌ Check access error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check access'
    });
  }
};