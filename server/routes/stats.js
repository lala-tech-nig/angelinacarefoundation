const router = require('express').Router();
const { getDashboardStats, getPublicStats } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

router.get('/public', getPublicStats);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
