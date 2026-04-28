const router = require('express').Router();
const { login, getMe, changePassword, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.put('/profile', protect, updateProfile);

module.exports = router;
