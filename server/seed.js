const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const seedAdmin = require('./utils/seedAdmin');

dotenv.config();

const runSeed = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI?.substring(0, 30) + '...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    console.log('⏳ Seeding admin...');
    await seedAdmin();
    console.log('✅ Seeding completed');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:');
    console.error(err);
    process.exit(1);
  }
};

runSeed();
