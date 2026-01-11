const Note = require('../models/noteModel');
const Purchase = require('../models/purchaseModel');
const path = require('path');
const fs = require('fs');

// @desc    Get all notes with filters
// @route   GET /api/notes
// @access  Public
exports.getAllNotes = async (req, res) => {
  try {
    const { college, course, semester, subject, search, sort, free } = req.query;

    // Build query
    let query = { status: 'active' };

    if (college) query.college = college;
    if (course) query.course = course;
    if (semester) query.semester = semester;
    if (subject) query.subject = subject;
    
    // Filter for free or paid notes
    if (free === 'true') {
      query.price = 0;
    } else if (free === 'false') {
      query.price = { $gt: 0 };
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOption = {};
    if (sort === 'price-low') {
      sortOption.price = 1;
    } else if (sort === 'price-high') {
      sortOption.price = -1;
    } else if (sort === 'newest') {
      sortOption.createdAt = -1;
    } else {
      sortOption.createdAt = -1; // Default: newest first
    }

    const notes = await Note.find(query)
      .sort(sortOption)
      .populate('uploadedBy', 'email role');

    // If user is logged in, check access for each note
    let notesWithAccess = notes;
    if (req.user) {
      notesWithAccess = await Promise.all(notes.map(async (note) => {
        const noteObj = note.toObject();
        
        // Free notes are always accessible
        if (noteObj.price === 0) {
          noteObj.hasAccess = true;
        } else {
          // Check if purchased
          const hasAccess = await Purchase.hasAccess(req.user.id, note._id, 'note');
          noteObj.hasAccess = hasAccess;
        }
        
        return noteObj;
      }));
    }

    res.status(200).json({
      success: true,
      count: notes.length,
      notes: notesWithAccess
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('uploadedBy', 'email role');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Increment views
    note.views += 1;
    await note.save();

    const noteObj = note.toObject();

    // Check access if user is logged in
    if (req.user) {
      if (noteObj.price === 0) {
        noteObj.hasAccess = true;
      } else {
        const hasAccess = await Purchase.hasAccess(req.user.id, note._id, 'note');
        noteObj.hasAccess = hasAccess;
      }
    }

    res.status(200).json({
      success: true,
      note: noteObj
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Upload new note
// @route   POST /api/notes
// @access  Private (Admin only)
exports.uploadNote = async (req, res) => {
  try {
    const { title, description, college, course, semester, subject, price } = req.body;

    // Validation
    if (!title || !description || !college || !course || !semester || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    // Create note
    const note = await Note.create({
      title,
      description,
      college,
      course,
      semester,
      subject,
      price: price || 0,
      pdfPath: req.file.filename,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Note uploaded successfully',
      note
    });
  } catch (error) {
    console.error('Upload note error:', error);
    
    // Delete uploaded file if note creation fails
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/notes', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private (Admin only)
exports.updateNote = async (req, res) => {
  try {
    const { title, description, college, course, semester, subject, price, status } = req.body;

    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Update fields
    if (title) note.title = title;
    if (description) note.description = description;
    if (college) note.college = college;
    if (course) note.course = course;
    if (semester) note.semester = semester;
    if (subject) note.subject = subject;
    if (price !== undefined) note.price = price;
    if (status) note.status = status;

    await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private (Admin only)
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Delete PDF file
    const filePath = path.join(__dirname, '../uploads/notes', note.pdfPath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Check user access to note
// @route   GET /api/notes/:id/access
// @access  Private
exports.checkAccess = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Free notes are always accessible
    if (note.price === 0) {
      return res.status(200).json({
        success: true,
        hasAccess: true,
        reason: 'free'
      });
    }

    // Check if purchased
    const hasAccess = await Purchase.hasAccess(req.user.id, note._id, 'note');

    res.status(200).json({
      success: true,
      hasAccess,
      reason: hasAccess ? 'purchased' : 'not_purchased'
    });
  } catch (error) {
    console.error('Check access error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};