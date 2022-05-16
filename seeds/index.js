const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

// pick a random place and descriptor from seedHelper:
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// async function that makes sure we can connect to db:
const seedDB = async () => {
  // delete previous entries:
  await Campground.deleteMany({});
  // loop over cites 50 times to create dynamic dummy data:
  for (let i = 0; i < 50; i++) {
    // pick a random number to grab a city
    const random1000 = Math.floor(Math.random() * 1000);
    // create new campground and set the location to be the city, state:
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      // use the random place and descriptor from 'sample':
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
