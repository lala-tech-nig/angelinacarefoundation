const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  image: { type: String },
  imagePublicId: { type: String },
  author: { type: String, default: 'Angelina Care Foundation' },
  category: { type: String, default: 'News' },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  publishedAt: { type: Date },
  views: { type: Number, default: 0 },
}, { timestamps: true });

NewsSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('News', NewsSchema);
