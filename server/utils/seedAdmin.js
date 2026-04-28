const Admin = require('../models/Admin');
const { seedSettings } = require('../controllers/settingsController');

const seedAdmin = async () => {
  try {
    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existing) {
      await Admin.create({
        name: 'Bamidele Esther Iweriebor',
        email: process.env.ADMIN_EMAIL || 'angelinacarefoundation@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'superadmin',
      });
      console.log('✅ Default admin created:', process.env.ADMIN_EMAIL);
    }
    await seedSettings();
    console.log('✅ Site settings seeded');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = seedAdmin;
