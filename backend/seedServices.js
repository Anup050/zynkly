const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');

dotenv.config();

const services = [
  {
    name: 'Standard Cleaning',
    description: 'A standard cleaning service for your home or office.',
    imageUrl: 'https://i.ibb.co/rK8TnvQm/room.jpg',
    duration: '2 hours',
  },
  {
    name: 'Deep Cleaning',
    description: 'A thorough deep cleaning for a fresh and spotless environment.',
    imageUrl: 'https://i.ibb.co/VWyfvGhq/bathroom.jpg',
    duration: '4 hours',
  },
  {
    name: 'Move In/Out Cleaning',
    description: 'Detailed cleaning for moving in or out of a property.',
    imageUrl: 'https://i.ibb.co/H5fNRRJ/kitchen-utenisl.png',
    duration: '5 hours',
  },
  {
    name: 'Carpet Cleaning',
    description: 'Professional carpet cleaning and stain removal.',
    imageUrl: 'https://i.ibb.co/rK8TnvQm/room.jpg',
    duration: '1.5 hours',
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zynkly');
    console.log('MongoDB connected.');

    await Service.deleteMany({});
    console.log('Cleared existing services.');

    await Service.insertMany(services);
    console.log('Successfully seeded services.');

    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
  }
};

seedDB();
