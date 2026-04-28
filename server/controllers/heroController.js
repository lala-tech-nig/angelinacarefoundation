const HeroSlide = require('../models/HeroSlide');
const { cloudinary } = require('../config/cloudinary');

// GET /api/hero - public
exports.getSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, slides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/hero/all - admin
exports.getAllSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, slides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/hero - admin
exports.createSlide = async (req, res) => {
  try {
    const { title, subtitle, description, ctaText, ctaLink, ctaSecondaryText, ctaSecondaryLink, order, overlay } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    const slide = await HeroSlide.create({
      title, subtitle, description, ctaText, ctaLink, ctaSecondaryText, ctaSecondaryLink,
      order: order || 0, overlay: overlay || 0.55,
      image: req.file.path,
      imagePublicId: req.file.filename,
    });
    res.status(201).json({ success: true, slide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/hero/:id - admin
exports.updateSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });
    const updates = { ...req.body };
    if (req.file) {
      if (slide.imagePublicId) await cloudinary.uploader.destroy(slide.imagePublicId);
      updates.image = req.file.path;
      updates.imagePublicId = req.file.filename;
    }
    const updated = await HeroSlide.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, slide: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/hero/:id - admin
exports.deleteSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });
    if (slide.imagePublicId) await cloudinary.uploader.destroy(slide.imagePublicId);
    await slide.deleteOne();
    res.json({ success: true, message: 'Slide deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
