// @desc    Check if user is admin
// @note    Must be used AFTER protect middleware
const admin = (req, res, next) => {
  // Check if user exists (from protect middleware)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please login'
    });
  }

  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  // User is admin, continue
  next();
};

module.exports = { admin };