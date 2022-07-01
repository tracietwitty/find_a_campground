const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

// pick a random place and descriptor from seedHelper:
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// pick a random image from Unsplash to display with the campground:
async function seedImg() {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: '7s3agHLsxNKMkuWI15Q_ZmJsO28SbqMYY9y7tw62Im4',
        collections: 8667598,
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error('This is working, but: ', err);
  }
}
// async function that makes sure we can connect to db:
const seedDB = async () => {
  // delete previous entries:
  await Campground.deleteMany({});
  // loop over cites 50 times to create dynamic dummy data:
  for (let i = 0; i < 20; i++) {
    // setup
    const placeSeed = Math.floor(Math.random() * places.length);
    const descriptorsSeed = Math.floor(Math.random() * descriptors.length);
    const citySeed = Math.floor(Math.random() * cities.length);

    // seed data into campground
    const campground = new Campground({
      title: `${descriptors[descriptorsSeed]} ${places[placeSeed]}`,
      location: `${cities[citySeed].city}, ${cities[citySeed].state}`,
      image: await seedImg(),
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
      price: Math.floor(Math.random() * 25),
    });

    await campground.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
