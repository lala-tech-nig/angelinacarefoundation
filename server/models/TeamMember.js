const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  imagePublicId: { type: String },
  email: { type: String },
  phone: { type: String },
  socials: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', TeamMemberSchema);
