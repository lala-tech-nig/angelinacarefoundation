const Gallery = require('../models/Gallery');
const { cloudinary } = require('../config/cloudinary');

exports.getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    const items = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    const { title, description, category, isFeatured } = req.body;
    const item = await Gallery.create({
      title, description, category: category || 'general',
      isFeatured: isFeatured === 'true',
      image: req.file.path, imagePublicId: req.file.filename,
    });
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      const old = await Gallery.findById(req.params.id);
      if (old && old.imagePublicId) await cloudinary.uploader.destroy(old.imagePublicId);
      updates.image = req.file.path; updates.imagePublicId = req.file.filename;
    }
    const item = await Gallery.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Image not found' });
    if (item.imagePublicId) await cloudinary.uploader.destroy(item.imagePublicId);
    await item.deleteOne();
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
