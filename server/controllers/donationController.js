const axios = require('axios');
const Donation = require('../models/Donation');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE = 'https://api.paystack.co';

const paystackHeaders = () => ({
  Authorization: `Bearer ${PAYSTACK_SECRET}`,
  'Content-Type': 'application/json',
});

/* ──────────────────────────────────────────────────────────
   POST /api/donations/initialize
   Body: { name, email, phone, amount, program, message, isAnonymous }
   Returns: { authorization_url, reference, access_code }
────────────────────────────────────────────────────────── */
exports.initializeDonation = async (req, res) => {
  try {
    const { name, email, phone, amount, program, message, isAnonymous } = req.body;

    if (!email) return res.status(400).json({ success: false, message: 'Email is required for payment.' });
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'A valid donation amount is required.' });
    }

    const amountInKobo = Math.round(Number(amount) * 100); // Paystack uses kobo

    // Initialize transaction with Paystack
    const paystackRes = await axios.post(
      `${PAYSTACK_BASE}/transaction/initialize`,
      {
        email,
        amount: amountInKobo,
        currency: 'NGN',
        metadata: {
          donor_name: isAnonymous ? 'Anonymous' : name,
          phone: phone || '',
          program: program || 'General',
          message: message || '',
          custom_fields: [
            { display_name: 'Donor Name', variable_name: 'donor_name', value: isAnonymous ? 'Anonymous' : (name || 'N/A') },
            { display_name: 'Program', variable_name: 'program', value: program || 'General Donation' },
          ],
        },
      },
      { headers: paystackHeaders() }
    );

    const { authorization_url, reference, access_code } = paystackRes.data.data;

    // Persist a pending donation record
    await Donation.create({
      name: isAnonymous ? 'Anonymous' : (name || 'Anonymous'),
      email,
      phone: phone || '',
      amount: Number(amount),
      currency: 'NGN',
      reference,
      status: 'pending',
      paymentMethod: 'paystack',
      message: message || '',
      isAnonymous: Boolean(isAnonymous),
      program: program || '',
    });

    res.json({ success: true, authorization_url, reference, access_code });
  } catch (err) {
    console.error('Paystack init error:', err?.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: err?.response?.data?.message || 'Payment initialization failed. Please try again.',
    });
  }
};

/* ──────────────────────────────────────────────────────────
   GET /api/donations/verify/:reference
   Verifies a payment with Paystack and updates DB record
────────────────────────────────────────────────────────── */
exports.verifyDonation = async (req, res) => {
  try {
    const { reference } = req.params;

    // Verify with Paystack
    const paystackRes = await axios.get(
      `${PAYSTACK_BASE}/transaction/verify/${reference}`,
      { headers: paystackHeaders() }
    );

    const txData = paystackRes.data.data;
    const isSuccess = txData.status === 'success';
    const newStatus = isSuccess ? 'success' : 'failed';

    // Update the donation record in DB
    const donation = await Donation.findOneAndUpdate(
      { reference },
      {
        status: newStatus,
        amount: txData.amount / 100, // Convert back from kobo
        currency: txData.currency,
      },
      { new: true }
    );

    if (!donation) {
      // Transaction was valid on Paystack but not in our DB — create a record
      if (isSuccess) {
        const newDonation = await Donation.create({
          name: txData.metadata?.donor_name || 'Anonymous',
          email: txData.customer?.email || '',
          amount: txData.amount / 100,
          currency: txData.currency || 'NGN',
          reference,
          status: 'success',
          paymentMethod: 'paystack',
          program: txData.metadata?.program || '',
          message: txData.metadata?.message || '',
        });
        return res.json({ success: true, verified: true, donation: newDonation });
      }
      return res.status(404).json({ success: false, message: 'Donation record not found.' });
    }

    res.json({
      success: true,
      verified: isSuccess,
      status: newStatus,
      donation,
      paystackStatus: txData.status,
    });
  } catch (err) {
    console.error('Paystack verify error:', err?.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: err?.response?.data?.message || 'Payment verification failed.',
    });
  }
};

/* ──────────────────────────────────────────────────────────
   POST /api/donations/webhook
   Paystack webhook — listens for server-side payment events
────────────────────────────────────────────────────────── */
exports.handleWebhook = async (req, res) => {
  try {
    const crypto = require('crypto');
    const secret = PAYSTACK_SECRET;
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference, amount, customer, metadata } = event.data;
      await Donation.findOneAndUpdate(
        { reference },
        { status: 'success', amount: amount / 100 },
        { upsert: false }
      );
      console.log(`✅ Webhook: Donation ${reference} marked as success.`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.sendStatus(500);
  }
};

/* ──────────────────────────────────────────────────────────
   GET /api/donations (Admin — protected)
────────────────────────────────────────────────────────── */
exports.getDonations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const donations = await Donation.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Donation.countDocuments(filter);
    const totalAmount = await Donation.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    res.json({
      success: true,
      donations,
      total,
      pages: Math.ceil(total / limit),
      totalRaised: totalAmount[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
