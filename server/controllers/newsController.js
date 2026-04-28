const News = require('../models/News');
const { cloudinary } = require('../config/cloudinary');

exports.getPublishedNews = async (req, res) => {
  try {
    const { page = 1, limit = 9, category } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    const news = await News.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await News.countDocuments(filter);
    res.json({ success: true, news, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!news) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.tags && typeof req.body.tags === 'string') {
      data.tags = req.body.tags.split(',').map(t => t.trim());
    }
    if (req.file) { data.image = req.file.path; data.imagePublicId = req.file.filename; }
    const news = await News.create(data);
    res.status(201).json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.tags && typeof req.body.tags === 'string') {
      data.tags = req.body.tags.split(',').map(t => t.trim());
    }
    if (req.file) {
      const old = await News.findById(req.params.id);
      if (old && old.imagePublicId) await cloudinary.uploader.destroy(old.imagePublicId);
      data.image = req.file.path;
      data.imagePublicId = req.file.filename;
    }
    const news = await News.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    if (news.imagePublicId) await cloudinary.uploader.destroy(news.imagePublicId);
    await news.deleteOne();
    res.json({ success: true, message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
