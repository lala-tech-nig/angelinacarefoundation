const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'NGN' },
  reference: { type: String, unique: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  paymentMethod: { type: String, default: 'paystack' },
  message: { type: String },
  isAnonymous: { type: Boolean, default: false },
  program: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);
