const router = require('express').Router();
const { getPublicSettings, getAllSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.get('/', getPublicSettings);
router.get('/all', protect, getAllSettings);
router.put('/', protect, updateSettings);

module.exports = router;
