const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!admin.isActive)
      return res.status(403).json({ success: false, message: 'Account is deactivated' });

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = signToken(admin._id);
    res.json({
      success: true,
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, avatar: admin.avatar },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

// PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!(await admin.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    admin.password = newPassword;
    await admin.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const admin = await Admin.findByIdAndUpdate(req.admin._id, { name, email }, { new: true, runValidators: true });
    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
