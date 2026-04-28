const router = require('express').Router();
const { createDonation, verifyDonation, getDonations } = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

router.post('/', createDonation);
router.get('/verify/:reference', verifyDonation);
router.get('/', protect, getDonations);

module.exports = router;
