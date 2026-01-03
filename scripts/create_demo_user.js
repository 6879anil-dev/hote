#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

async function createDemoUser() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log('Connected to database');

    const email = process.env.DEMO_USER_EMAIL || 'demo@example.com';
    const name = process.env.DEMO_USER_NAME || 'demouser';
    const password = process.env.DEMO_USER_PASSWORD || 'Demo1234!';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Demo user already exists:');
      console.log('  email:', existing.email);
      console.log('  id:   ', existing._id.toString());
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);

    const u = new User({
      email,
      name,
      password: hashed,
      emailActive: true
    });

    await u.save();

    console.log('Demo user created successfully:');
    console.log('  email:', email);
    console.log('  password:', password);
    console.log('  id:   ', u._id.toString());
    process.exit(0);
  } catch (err) {
    console.error('Error creating demo user:', err);
    process.exit(1);
  }
}

createDemoUser();
