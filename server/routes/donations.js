const router = require('express').Router();
const {
  initializeDonation,
  verifyDonation,
  handleWebhook,
  getDonations,
} = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/initialize', initializeDonation);          // POST: Start a payment
router.get('/verify/:reference', verifyDonation);        // GET:  Verify after payment
router.post('/webhook', handleWebhook);                  // POST: Paystack webhook (server-side)

// Admin-protected route
router.get('/', protect, getDonations);                  // GET:  All donations (admin)

module.exports = router;
