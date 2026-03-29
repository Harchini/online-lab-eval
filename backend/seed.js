/**
 * seed.js — Run this ONCE to create the staff account and a demo student account.
 * Usage: node seed.js
 * 
 * Advanced Node.js Technique: Using async/await with MongoDB via Mongoose
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Remove old seed data
    await User.deleteMany({ regNo: { $in: ['STAFF001', '22CS001'] } });

    // Create staff account
    await User.create({ regNo: 'STAFF001', password: 'staff123', role: 'staff' });
    console.log('✅ Staff created  → RegNo: STAFF001 | Password: staff123');

    // Create demo student account
    await User.create({ regNo: '22CS001', password: 'student123', role: 'student' });
    console.log('✅ Student created → RegNo: 22CS001 | Password: student123');

    await mongoose.disconnect();
    console.log('\n🎉 Seeding complete! You can now run the server.');
    process.exit(0);
};

seed().catch((err) => {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
});
