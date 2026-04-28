const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hero', require('./routes/hero'));
app.use('/api/programs', require('./routes/programs'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/team', require('./routes/team'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/news', require('./routes/news'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Angelina Care Foundation API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);
      // Seed admin and settings
      const seedAdmin = require('./utils/seedAdmin');
      await seedAdmin();
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

module.exports = app;
