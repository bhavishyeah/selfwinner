const Bundle = require('../models/bundleModel');
const Note = require('../models/noteModel');
const Purchase = require('../models/purchaseModel');

// @desc    Get all bundles
// @route   GET /api/bundles
// @access  Public
exports.getAllBundles = async (req, res) => {
  try {
    const { college, course, semester } = req.query;

    // Build query
    let query = { status: 'active' };

    if (college) query.college = college;
    if (course) query.course = course;
    if (semester) query.semester = semester;

    const bundles = await Bundle.find(query)
      .populate('noteIds', 'title subject price')
      .populate('createdBy', 'email role')
      .sort({ createdAt: -1 });

    // If user is logged in, check access for each bundle
    let bundlesWithAccess = bundles;
    if (req.user) {
      bundlesWithAccess = await Promise.all(bundles.map(async (bundle) => {
        const bundleObj = bundle.toObject();
        
        // Check if purchased
        const hasAccess = await Purchase.hasAccess(req.user.id, bundle._id, 'bundle');
        bundleObj.hasAccess = hasAccess;
        
        return bundleObj;
      }));
    }

    res.status(200).json({
      success: true,
      count: bundles.length,
      bundles: bundlesWithAccess
    });
  } catch (error) {
    console.error('Get bundles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single bundle
// @route   GET /api/bundles/:id
// @access  Public
exports.getBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id)
      .populate('noteIds', 'title description subject price')
      .populate('createdBy', 'email role');

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }

    const bundleObj = bundle.toObject();

    // Check access if user is logged in
    if (req.user) {
      const hasAccess = await Purchase.hasAccess(req.user.id, bundle._id, 'bundle');
      bundleObj.hasAccess = hasAccess;
    }

    res.status(200).json({
      success: true,
      bundle: bundleObj
    });
  } catch (error) {
    console.error('Get bundle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new bundle
// @route   POST /api/bundles
// @access  Private (Admin only)
exports.createBundle = async (req, res) => {
  try {
    const { title, description, price, noteIds, college, course, semester } = req.body;

    // Validation
    if (!title || !description || !price || !noteIds || !college || !course || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Bundle must contain at least one note'
      });
    }

    // Verify all notes exist
    const notes = await Note.find({ _id: { $in: noteIds }, status: 'active' });
    if (notes.length !== noteIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some notes not found or inactive'
      });
    }

    // Create bundle
    const bundle = await Bundle.create({
      title,
      description,
      price,
      noteIds,
      college,
      course,
      semester,
      createdBy: req.user.id
    });

    const populatedBundle = await Bundle.findById(bundle._id)
      .populate('noteIds', 'title subject price');

    res.status(201).json({
      success: true,
      message: 'Bundle created successfully',
      bundle: populatedBundle
    });
  } catch (error) {
    console.error('Create bundle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update bundle
// @route   PUT /api/bundles/:id
// @access  Private (Admin only)
exports.updateBundle = async (req, res) => {
  try {
    const { title, description, price, noteIds, status } = req.body;

    let bundle = await Bundle.findById(req.params.id);

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }

    // Update fields
    if (title) bundle.title = title;
    if (description) bundle.description = description;
    if (price !== undefined) bundle.price = price;
    if (status) bundle.status = status;
    
    if (noteIds) {
      // Verify all notes exist
      const notes = await Note.find({ _id: { $in: noteIds }, status: 'active' });
      if (notes.length !== noteIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Some notes not found or inactive'
        });
      }
      bundle.noteIds = noteIds;
    }

    await bundle.save();

    const updatedBundle = await Bundle.findById(bundle._id)
      .populate('noteIds', 'title subject price');

    res.status(200).json({
      success: true,
      message: 'Bundle updated successfully',
      bundle: updatedBundle
    });
  } catch (error) {
    console.error('Update bundle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete bundle
// @route   DELETE /api/bundles/:id
// @access  Private (Admin only)
exports.deleteBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }

    await bundle.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Bundle deleted successfully'
    });
  } catch (error) {
    console.error('Delete bundle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add note to bundle
// @route   POST /api/bundles/:id/notes
// @access  Private (Admin only)
exports.addNoteToBundle = async (req, res) => {
  try {
    const { noteId } = req.body;

    const bundle = await Bundle.findById(req.params.id);

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }

    // Check if note exists
    const note = await Note.findById(noteId);
    if (!note || note.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Note not found or inactive'
      });
    }

    // Check if note already in bundle
    if (bundle.noteIds.includes(noteId)) {
      return res.status(400).json({
        success: false,
        message: 'Note already in bundle'
      });
    }

    bundle.noteIds.push(noteId);
    await bundle.save();

    const updatedBundle = await Bundle.findById(bundle._id)
      .populate('noteIds', 'title subject price');

    res.status(200).json({
      success: true,
      message: 'Note added to bundle',
      bundle: updatedBundle
    });
  } catch (error) {
    console.error('Add note to bundle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove note from bundle
// @route   DELETE /api/bundles/:id/notes/:noteId
// @access  Private (Admin only)
exports.removeNoteFromBundle = async (req, res) => {
  try {
    const { noteId } = req.params;

    const bundle = await Bundle.findById(req.params.id);

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }

    // Remove note from bundle
    bundle.noteIds = bundle.noteIds.filter(id => id.toString() !== noteId);
    await bundle.save();

    const updatedBundle = await Bundle.findById(bundle._id)
      .populate('noteIds', 'title subject price');

    res.status(200).json({
      success: true,
      message: 'Note removed from bundle',
      bundle: updatedBundle
    });
  } catch (error) {
    console.error('Remove note from bundle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};