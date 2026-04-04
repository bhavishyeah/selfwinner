const jwt = require('jsonwebtoken');
const Note = require('../models/noteModel');
const Bundle = require('../models/bundleModel');
const Purchase = require('../models/purchaseModel');

// Stream note PDF with access verification
exports.viewNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const token = req.query.token;
    
    console.log('📥 View note request:', { noteId: id, hasToken: !!token });

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified, user:', decoded.userId);
    } catch (error) {
      console.log('❌ Invalid token:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token'
      });
    }

    const userId = decoded.userId;

    const note = await Note.findById(id);
    if (!note) {
      console.log('❌ Note not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    console.log('📄 Note found:', note.title, '- Price:', note.price);

    let hasAccess = false;

    if (note.price === 0) {
      hasAccess = true;
      console.log('✅ Free note - access granted');
    } else {
      const purchase = await Purchase.findOne({
        userId,
        itemType: 'note',
        itemId: id,
        status: 'completed'
      });

      if (purchase) {
        hasAccess = true;
        console.log('✅ Purchase found - access granted');
      }

      if (!hasAccess) {
        const bundlePurchase = await Purchase.findOne({
          userId,
          itemType: 'bundle',
          status: 'completed'
        }).populate('itemId');

        if (bundlePurchase && bundlePurchase.itemId) {
          const bundle = bundlePurchase.itemId;
          if (bundle.noteIds && bundle.noteIds.some(noteId => noteId.toString() === id)) {
            hasAccess = true;
            console.log('✅ Note in purchased bundle - access granted');
          }
        }
      }
    }

    if (!hasAccess) {
      console.log('❌ Access denied - no purchase found');
      return res.status(403).json({
        success: false,
        message: 'Access denied. Purchase required.'
      });
    }

    // Increment view count
    await Note.findByIdAndUpdate(id, {
      $inc: { views: 1 }
    });

    // ✅ Build Cloudinary URL from pdfPath
    if (!note.pdfPath) {
      console.log('❌ No PDF path found for note:', id);
      return res.status(404).json({
        success: false,
        message: 'PDF file not found'
      });
    }

    const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${note.pdfPath}`;
    console.log('✅ Redirecting to Cloudinary:', cloudinaryUrl);
    res.redirect(cloudinaryUrl);

  } catch (error) {
    console.error('❌ View note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get list of accessible notes for user
exports.getAccessibleNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await Purchase.find({
      userId,
      status: 'completed'
    });

    const noteIds = purchases
      .filter(p => p.itemType === 'note')
      .map(p => p.itemId);

    const bundlePurchases = purchases
      .filter(p => p.itemType === 'bundle');

    for (const purchase of bundlePurchases) {
      const bundle = await Bundle.findById(purchase.itemId);
      if (bundle && bundle.noteIds) {
        noteIds.push(...bundle.noteIds);
      }
    }

    const notes = await Note.find({
      $or: [
        { _id: { $in: noteIds } },
        { price: 0 }
      ]
    });

    res.status(200).json({
      success: true,
      notes
    });
  } catch (error) {
    console.error('Get accessible notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get accessible notes'
    });
  }
};