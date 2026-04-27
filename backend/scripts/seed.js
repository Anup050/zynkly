require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zynkly';

const services = [
  {
    name: 'Kitchen Cleaning',
    description: 'Includes slab cleaning, stove & appliance wiping, sink sanitization, and basic kitchen organization.',
    duration: '30 min',
  },
  {
    name: 'Washroom + Kitchen Cleaning',
    description: 'Includes toilet cleaning, sink sanitization, floor cleaning, kitchen counter wiping, and basic organization.',
    duration: '30 min',
  },
  {
    name: 'Full Room (Room + Washroom + Kitchen) Cleaning',
    description: 'Includes room cleaning, washroom sanitization, kitchen cleaning, floor mopping, and organizing.',
    duration: '30 min',
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Seeding...');

  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log('Services seeded.');

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const updated = await User.findOneAndUpdate(
      { email: adminEmail },
      { isAdmin: true },
      { new: true }
    );
    if (updated) console.log('Admin set for:', adminEmail);
    else console.log('No user found with email', adminEmail, '- create one by logging in first, then set ADMIN_EMAIL and run seed again.');
  } else {
    console.log('Set ADMIN_EMAIL in .env and run seed again to make a user admin.');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
