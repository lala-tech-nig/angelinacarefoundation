const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: { type: mongoose.Schema.Types.Mixed },
  category: { type: String, default: 'general' },
  label: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
