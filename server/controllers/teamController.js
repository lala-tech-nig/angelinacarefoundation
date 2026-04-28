const TeamMember = require('../models/TeamMember');
const { cloudinary } = require('../config/cloudinary');

exports.getTeam = async (req, res) => {
  try {
    const team = await TeamMember.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllTeam = async (req, res) => {
  try {
    const team = await TeamMember.find().sort({ order: 1 });
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createMember = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.socials && typeof req.body.socials === 'string') data.socials = JSON.parse(req.body.socials);
    if (req.file) { data.image = req.file.path; data.imagePublicId = req.file.filename; }
    const member = await TeamMember.create(data);
    res.status(201).json({ success: true, member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.socials && typeof req.body.socials === 'string') data.socials = JSON.parse(req.body.socials);
    if (req.file) {
      const old = await TeamMember.findById(req.params.id);
      if (old && old.imagePublicId) await cloudinary.uploader.destroy(old.imagePublicId);
      data.image = req.file.path; data.imagePublicId = req.file.filename;
    }
    const member = await TeamMember.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    if (member.imagePublicId) await cloudinary.uploader.destroy(member.imagePublicId);
    await member.deleteOne();
    res.json({ success: true, message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
