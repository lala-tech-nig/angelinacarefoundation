const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  image: { type: String },
  imagePublicId: { type: String },
  icon: { type: String, default: '🌟' },
  category: {
    type: String,
    enum: ['women-empowerment', 'youth-development', 'education', 'healthcare', 'community-welfare', 'sustainable-development'],
    required: true,
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  beneficiaries: { type: Number, default: 0 },
}, { timestamps: true });

ProgramSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Program', ProgramSchema);
