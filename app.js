const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('home');
});

// GET All Available Campgrounds:
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  // pass returned campgrounds into our template:
  res.render('campgrounds/index', { campgrounds });
});

// GET New Campground Form:
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// POST New Campground:
app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  // redirect to new campground page:
  res.redirect(`/campgrounds/${campground._id}`);
});

// GET Specific Campground:
app.get('/campgrounds/:id', async (req, res) => {
  // save specific campgrounds:
  const campground = await Campground.findById(req.params.id);
  // pass returned campground into our template:
  res.render('campgrounds/show', { campground });
});

// EDIT an existing campground:
app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

// DELETE an existing campground:
app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});

app.listen(3000, () => {
  console.log('Serving on PORT 3000');
});
