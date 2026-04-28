const Program = require('../models/Program');
const { cloudinary } = require('../config/cloudinary');

exports.getPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, programs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ order: 1 });
    res.json({ success: true, programs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) { data.image = req.file.path; data.imagePublicId = req.file.filename; }
    const program = await Program.create(data);
    res.status(201).json({ success: true, program });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    const updates = { ...req.body };
    if (req.file) {
      if (program.imagePublicId) await cloudinary.uploader.destroy(program.imagePublicId);
      updates.image = req.file.path; updates.imagePublicId = req.file.filename;
    }
    const updated = await Program.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, program: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    if (program.imagePublicId) await cloudinary.uploader.destroy(program.imagePublicId);
    await program.deleteOne();
    res.json({ success: true, message: 'Program deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
