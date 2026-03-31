const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  price: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  poster: {
    type: String,
    required: true
  },
  backdrop: {
    type: String,
    default: ''
  },
  image2: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  organizer: {
    type: String,
    default: ''
  },
  ticketsAvailable: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
