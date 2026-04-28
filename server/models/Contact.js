const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['general', 'partnership', 'volunteer', 'donation'], default: 'general' },
  status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
  adminNotes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
