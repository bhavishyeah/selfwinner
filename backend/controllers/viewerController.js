const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Note = require('../models/noteModel');
const Bundle = require('../models/bundleModel');
const Purchase = require('../models/purchaseModel');

// Stream note PDF with access verification
exports.viewNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get token from query parameter
    const token = req.query.token;
    
    console.log('📥 View note request:', { noteId: id, hasToken: !!token });

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    // Verify token
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

    // Get note
    const note = await Note.findById(id);
    if (!note) {
      console.log('❌ Note not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    console.log('📄 Note found:', note.title, '- Price:', note.price);

    // Check access
    let hasAccess = false;

    // Free notes are accessible to all authenticated users
    if (note.price === 0) {
      hasAccess = true;
      console.log('✅ Free note - access granted');
    } else {
      // Check if user has purchased
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

      // Also check if note is in a purchased bundle
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

    // Stream PDF
    const filePath = path.join(__dirname, '../uploads/notes', note.pdfPath);
    console.log('📂 File path:', filePath);

    if (!fs.existsSync(filePath)) {
      console.log('❌ File not found on disk:', filePath);
      return res.status(404).json({
        success: false,
        message: 'PDF file not found'
      });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    console.log('✅ Streaming PDF:', note.pdfPath, '- Size:', fileSize, 'bytes');

    // Set headers for PDF streaming
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Disposition', 'inline; filename="' + note.title + '.pdf"');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Stream the file
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

    readStream.on('error', (error) => {
      console.error('❌ Stream error:', error);
      res.status(500).json({
        success: false,
        message: 'Error streaming file'
      });
    });
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

    // Get all purchases
    const purchases = await Purchase.find({
      userId,
      status: 'completed'
    });

    // Get note IDs from purchases
    const noteIds = purchases
      .filter(p => p.itemType === 'note')
      .map(p => p.itemId);

    // Get notes from bundle purchases
    const bundlePurchases = purchases
      .filter(p => p.itemType === 'bundle');

    for (const purchase of bundlePurchases) {
      const bundle = await Bundle.findById(purchase.itemId);
      if (bundle && bundle.noteIds) {
        noteIds.push(...bundle.noteIds);
      }
    }

    // Get all notes
    const notes = await Note.find({
      $or: [
        { _id: { $in: noteIds } },
        { price: 0 } // Include free notes
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