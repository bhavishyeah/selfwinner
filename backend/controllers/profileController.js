const Profile = require('../models/profileModel');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create your profile.'
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Create or update user profile
// @route   POST /api/profile
// @access  Private
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { college, course, semester, hobbies, language, gender, personality } = req.body;

    // Validation
    if (!college || !course || !semester) {
      return res.status(400).json({
        success: false,
        message: 'College, course, and semester are required'
      });
    }

    // Check if profile exists
    let profile = await Profile.findOne({ userId: req.user._id });

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { userId: req.user._id },
        {
          college,
          course,
          semester,
          hobbies,
          language,
          gender,
          personality,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      );

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        profile
      });
    } else {
      // Create new profile
      profile = await Profile.create({
        userId: req.user._id,
        college,
        course,
        semester,
        hobbies,
        language,
        gender,
        personality
      });

      return res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        profile
      });
    }
  } catch (error) {
    console.error('Create/Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving profile',
      error: error.message
    });
  }
};

// @desc    Delete user profile
// @route   DELETE /api/profile
// @access  Private
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting profile',
      error: error.message
    });
  }
};