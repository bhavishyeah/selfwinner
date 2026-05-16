const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getStats,
  toggleBan,
  getAllPurchases,
  getAdminNotes,
  updateAdminNote,
  getAdminTransactions,
  getAdminSettings,
  updateAdminSettings,
refundTransaction,
  createAdminNotification,
getAdminNotifications,
  getAdminAuditLogs,
  exportAdminAuditLogsCsv,
  updateAdminNotification
} = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(protect, admin);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', getAllUsers);

// @route   GET /api/admin/users/:id
// @desc    Get single user with details
// @access  Private (Admin only)
router.get('/users/:id', getUser);

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/users/:id', updateUser);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:id', deleteUser);

// @route   PUT /api/admin/users/:id/ban
// @desc    Ban/Unban user
// @access  Private (Admin only)
router.put('/users/:id/ban', toggleBan);

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Private (Admin only)
router.get('/stats', getStats);

// @route   GET /api/admin/purchases
// @desc    Get all purchases
// @access  Private (Admin only)
router.get('/purchases', getAllPurchases);

router.get('/notes', getAdminNotes);
// @route   PATCH /api/admin/notes/:id
router.patch('/notes/:id', updateAdminNote);
// @route   GET /api/admin/transactions
router.get('/transactions', getAdminTransactions);
// @route   POST /api/admin/transactions/:id/refund
router.post('/transactions/:id/refund', refundTransaction);
// @route   GET /api/admin/settings
router.get('/settings', getAdminSettings);
// @route   PATCH /api/admin/settings
router.patch('/settings', updateAdminSettings);

module.exports = router;
// @route   POST /api/admin/notifications
router.post('/notifications', createAdminNotification);
// @route   GET /api/admin/notifications
router.get('/notifications', getAdminNotifications);

// @route   GET /api/admin/audit-logs
router.get('/audit-logs', getAdminAuditLogs);

// @route   GET /api/admin/audit-logs/export
router.get('/audit-logs/export', exportAdminAuditLogsCsv);

// @route   PATCH /api/admin/notifications/:id
router.patch('/notifications/:id', updateAdminNotification);