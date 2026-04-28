const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  imagePublicId: { type: String },
  category: { type: String, default: 'general' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);
