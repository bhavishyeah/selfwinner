const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Note = require('../models/noteModel');
const Bundle = require('../models/bundleModel');
const Purchase = require('../models/purchaseModel');
    const Setting = require('../models/settingsModel');
    const Notification = require('../models/notificationModel');
    const AdminAuditLog = require('../models/adminAuditLogModel');

const createAuditLog = async (req, actionType, targetType, targetId, details = {}) => {
  try {
    await AdminAuditLog.create({
      adminId: req.user.id,
      adminEmail: req.user.email || '',
      actionType,
      targetType,
      targetId: String(targetId),
      details,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || ''
    });
  } catch (e) {
    console.error('Audit log error:', e.message);
  }
};
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
exports.getAdminNotes = async (req, res) => {
  try {
    const { search = '', status = '', page = 1, limit = 25 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [notes, total] = await Promise.all([
      Note.find(query).populate('uploader', 'email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Note.countDocuments(query)
    ]);

    res.status(200).json({ success: true, notes, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdminNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
const editable = ['title', 'description', 'subject', 'course', 'semester', 'college', 'price', 'status', 'featured', 'rejectedReason'];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) note[field] = req.body[field];
    });
    note.lastEditedBy = req.user.id;
    note.lastEditedAt = new Date();
    await note.save();
        await createAuditLog(req, 'NOTE_UPDATED', 'note', note._id, { updates: req.body });
    res.status(200).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminTransactions = async (req, res) => {
  try {
    const { search = '', status = '' } = req.query;
    const query = {};
    if (status) query.status = status;
    const transactions = await Purchase.find(query)
      .populate('userId', 'email')
      .populate('itemId', 'title uploader price')
      .sort({ createdAt: -1 })
      .limit(500);

    const filtered = transactions.filter((t) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        t._id.toString().toLowerCase().includes(s) ||
        t.userId?.email?.toLowerCase().includes(s) ||
        t.itemId?.title?.toLowerCase().includes(s)
      );
    });

    res.status(200).json({ success: true, transactions: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminSettings = async (req, res) => {
  try {
    const settings = await Setting.find({});
    const map = settings.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    res.status(200).json({ success: true, settings: map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdminSettings = async (req, res) => {
  try {
    const updates = req.body || {};
    await Promise.all(
      Object.keys(updates).map((key) =>
        Setting.findOneAndUpdate({ key }, { key, value: updates[key] }, { upsert: true, new: true })
      )
    );
    const settings = await Setting.find({});
    const map = settings.reduce((acc, item) => ((acc[item.key] = item.value), acc), {});
        await createAuditLog(req, 'SETTINGS_UPDATED', 'settings', 'global', { keys: Object.keys(updates) });
    res.status(200).json({ success: true, settings: map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refundTransaction = async (req, res) => {
  try {
    const { reason = 'Admin initiated refund', refundAmount = null, refundType = 'full' } = req.body || {};    const tx = await Purchase.findById(req.params.id);
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (tx.status === 'refunded') return res.status(400).json({ success: false, message: 'Already refunded' });

    tx.status = 'refunded';
    tx.refundReason = reason;
    tx.refundedAt = new Date();
     tx.refundAmount = refundAmount !== null ? Number(refundAmount) : Number(tx.amount || 0);
    tx.refundType = refundType;
    await tx.save();
 await createAuditLog(req, 'TRANSACTION_REFUNDED', 'transaction', tx._id, { reason, refundAmount: tx.refundAmount, refundType });
    res.status(200).json({ success: true, transaction: tx });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAdminNotification = async (req, res) => {
  try {
    const { subject, message, audience = 'all', channel = 'in_app', scheduleAt } = req.body;
    const notification = await Notification.create({
      subject,
      message,
      audience,
      channel,
      scheduleAt: scheduleAt || null,
      sentAt: scheduleAt ? null : new Date(),
      status: scheduleAt ? 'scheduled' : 'sent',
      createdBy: req.user.id
    });
    await createAuditLog(req, 'NOTIFICATION_CREATED', 'notification', notification._id, { subject, audience, channel, scheduleAt });
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(200);
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminAuditLogs = async (req, res) => {
  try {
    const { actionType = '', adminEmail = '', dateFrom = '', dateTo = '' } = req.query;    const query = {};
    if (actionType) query.actionType = actionType;
    if (adminEmail) query.adminEmail = { $regex: adminEmail, $options: 'i' };
      if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    const logs = await AdminAuditLog.find(query).sort({ createdAt: -1 }).limit(500);
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportAdminAuditLogsCsv = async (req, res) => {
  try {
    const logs = await AdminAuditLog.find({}).sort({ createdAt: -1 }).limit(2000);
    const header = 'timestamp,adminEmail,actionType,targetType,targetId,ipAddress';
    const rows = logs
      .map((l) =>
        [
          new Date(l.createdAt).toISOString(),
          (l.adminEmail || '').replace(/,/g, ' '),
          (l.actionType || '').replace(/,/g, ' '),
          (l.targetType || '').replace(/,/g, ' '),
          (l.targetId || '').replace(/,/g, ' '),
          (l.ipAddress || '').replace(/,/g, ' ')
        ].join(',')
      )
      .join('');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="admin-audit-logs.csv"');
    res.status(200).send(header + rows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateAdminNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });

    const { status, scheduleAt } = req.body || {};
    if (status) notification.status = status;
    if (scheduleAt !== undefined) notification.scheduleAt = scheduleAt || null;
    if (status === 'sent') notification.sentAt = new Date();
    await notification.save();

    await createAuditLog(req, 'NOTIFICATION_UPDATED', 'notification', notification._id, { status, scheduleAt });
    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};