const SiteSettings = require('../models/SiteSettings');

const defaultSettings = [
  { key: 'site_name', value: 'Angelina Care Foundation', category: 'general', label: 'Site Name' },
  { key: 'site_tagline', value: 'Compassion in Action. Impact for Generations.', category: 'general', label: 'Tagline' },
  { key: 'site_email', value: 'angelinacarefoundation@gmail.com', category: 'general', label: 'Email' },
  { key: 'site_phone1', value: '08136618814', category: 'general', label: 'Phone 1' },
  { key: 'site_phone2', value: '07018205027', category: 'general', label: 'Phone 2' },
  { key: 'site_address', value: '6 Olukunle Street, Ilupeju Oloponda Estate', category: 'general', label: 'Address' },
  { key: 'site_logo', value: '', category: 'general', label: 'Logo URL' },
  { key: 'paystack_link', value: 'https://paystack.com/pay/angelina-care', category: 'payment', label: 'Paystack Payment Link' },
  { key: 'facebook_url', value: '', category: 'social', label: 'Facebook URL' },
  { key: 'twitter_url', value: '', category: 'social', label: 'Twitter URL' },
  { key: 'instagram_url', value: '', category: 'social', label: 'Instagram URL' },
  { key: 'youtube_url', value: '', category: 'social', label: 'YouTube URL' },
  { key: 'about_text', value: 'Angelina Care Foundation is a purpose-driven non-governmental organization committed to improving lives and transforming communities.', category: 'about', label: 'About Text' },
  { key: 'mission', value: 'To support communities through empowerment, education, healthcare, welfare, and sustainable development programs.', category: 'about', label: 'Mission' },
  { key: 'vision', value: 'To build stronger, healthier, educated, and economically empowered communities where every individual has the opportunity to succeed.', category: 'about', label: 'Vision' },
];

exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.find();
    const map = {};
    settings.forEach(s => { map[s.key] = s.value; });
    res.json({ success: true, settings: map });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.find().sort({ category: 1, key: 1 });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    const ops = Object.entries(updates).map(([key, value]) => ({
      updateOne: { filter: { key }, update: { $set: { value } }, upsert: true },
    }));
    await SiteSettings.bulkWrite(ops);
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.seedSettings = async () => {
  for (const s of defaultSettings) {
    await SiteSettings.findOneAndUpdate({ key: s.key }, s, { upsert: true });
  }
};
