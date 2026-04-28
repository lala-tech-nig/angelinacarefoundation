const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message, type } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });

    const contact = await Contact.create({ name, email, phone, subject, message, type: type || 'general' });

    // Send notification email (non-blocking)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact: ${subject}`,
        html: `<h3>New message from ${name}</h3><p><b>Email:</b> ${email}</p><p><b>Phone:</b> ${phone || 'N/A'}</p><p><b>Type:</b> ${type}</p><p><b>Message:</b><br/>${message}</p>`,
      }).catch(console.error);
    }
    res.status(201).json({ success: true, message: 'Message sent successfully! We\'ll get back to you soon.', contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const contacts = await Contact.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Contact.countDocuments(filter);
    res.json({ success: true, contacts, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateContactStatus = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
