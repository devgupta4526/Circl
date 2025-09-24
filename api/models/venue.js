const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: Number,
});

const sportSchema = new mongoose.Schema({
  id: String,
  name: String,
  icon: String,
  price: Number,
  courts: [courtSchema],
});

const bookingSchema = new mongoose.Schema({
  courtNumber: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sport: { type: String, required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
});

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: Number,
  image: String,
  deferLink: String,
  fullLink: String,
  avgRating: Number,
  ratingCount: Number,
  lat: Number,
  lng: Number,
  icon: String,
  interestsAvailable: [sportSchema], // was sportsAvailable
  location: String,
  address: { type: String, required: true },
  bookings: [bookingSchema],
});

const Venue = mongoose.models.Venue || mongoose.model('Venue', venueSchema);

module.exports = Venue;
