const Donation = require('../models/Donation');

exports.createDonation = async (req, res) => {
  try {
    const { name, email, phone, amount, message, isAnonymous, program } = req.body;
    const reference = 'ACF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const donation = await Donation.create({ name, email, phone, amount, message, isAnonymous, program, reference });
    res.status(201).json({ success: true, donation, reference });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyDonation = async (req, res) => {
  try {
    const { reference } = req.params;
    const donation = await Donation.findOneAndUpdate({ reference }, { status: 'success' }, { new: true });
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
    res.json({ success: true, donation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const donations = await Donation.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Donation.countDocuments(filter);
    const totalAmount = await Donation.aggregate([{ $match: { status: 'success' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    res.json({ success: true, donations, total, pages: Math.ceil(total / limit), totalRaised: totalAmount[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
