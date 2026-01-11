const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Note = require('../models/noteModel');
const Bundle = require('../models/bundleModel');
const Purchase = require('../models/purchaseModel');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search } = req.query;

    // Build query
    let query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    // Get profiles for each user
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await Profile.findOne({ userId: user._id });
        return {
          ...user.toObject(),
          profile: profile || null
        };
      })
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users: usersWithProfiles
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get profile
    const profile = await Profile.findOne({ userId: user._id });

    // Get purchases
    const purchases = await Purchase.find({
      userId: user._id,
      status: 'completed'
    })
      .populate('itemId', 'title price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        profile: profile || null,
        purchases: purchases
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent changing own admin role
    if (req.user.id === user._id.toString() && role && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own admin role'
      });
    }

    // Update fields
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting own account
    if (req.user.id === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete associated profile
    await Profile.deleteOne({ userId: user._id });

    // Delete user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    // Note stats
    const totalNotes = await Note.countDocuments();
    const activeNotes = await Note.countDocuments({ status: 'active' });
    const freeNotes = await Note.countDocuments({ price: 0, status: 'active' });
    const paidNotes = await Note.countDocuments({ price: { $gt: 0 }, status: 'active' });

    // Bundle stats
    const totalBundles = await Bundle.countDocuments();
    const activeBundles = await Bundle.countDocuments({ status: 'active' });

    // Purchase stats
    const totalPurchases = await Purchase.countDocuments({ status: 'completed' });
    const totalRevenue = await Purchase.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Recent activity
    const recentUsers = await User.find()
      .select('email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPurchases = await Purchase.find({ status: 'completed' })
      .populate('userId', 'email')
      .populate('itemId', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          admins: adminUsers
        },
        notes: {
          total: totalNotes,
          active: activeNotes,
          free: freeNotes,
          paid: paidNotes
        },
        bundles: {
          total: totalBundles,
          active: activeBundles
        },
        purchases: {
          total: totalPurchases,
          revenue: totalRevenue[0]?.total || 0
        },
        recent: {
          users: recentUsers,
          purchases: recentPurchases
        }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Ban/Unban user
// @route   PUT /api/admin/users/:id/ban
// @access  Private (Admin only)
exports.toggleBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent banning own account
    if (req.user.id === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot ban your own account'
      });
    }

    // Prevent banning other admins
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot ban admin users'
      });
    }

    // Toggle ban
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isActive ? 'User unbanned successfully' : 'User banned successfully',
      user: {
        id: user._id,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle ban error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all purchases (admin view)
// @route   GET /api/admin/purchases
// @access  Private (Admin only)
exports.getAllPurchases = async (req, res) => {
  try {
    const { status, itemType } = req.query;

    // Build query
    let query = {};

    if (status) query.status = status;
    if (itemType) query.itemType = itemType;

    const purchases = await Purchase.find(query)
      .populate('userId', 'email')
      .populate('itemId', 'title price')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: purchases.length,
      purchases
    });
  } catch (error) {
    console.error('Get all purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};