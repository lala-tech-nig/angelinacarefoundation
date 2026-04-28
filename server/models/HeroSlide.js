const mongoose = require('mongoose');

const HeroSlideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  image: { type: String, required: true },
  imagePublicId: { type: String },
  ctaText: { type: String, default: 'Learn More' },
  ctaLink: { type: String, default: '#about' },
  ctaSecondaryText: { type: String, default: 'Donate Now' },
  ctaSecondaryLink: { type: String, default: '#donate' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  overlay: { type: Number, default: 0.55, min: 0, max: 1 },
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', HeroSlideSchema);
