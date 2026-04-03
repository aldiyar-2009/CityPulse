const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  director: { type: String, required: true }, // unique field
  cast: { type: [String], default: [] }, // unique field
  duration: { type: Number, required: true }, // unique field, minutes
  rating: { type: Number, default: 0, min: 0, max: 5 },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  poster: { type: String, required: true },
  backdrop: { type: String, default: '' },
  age: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  ticketsAvailable: { type: Number, default: 100 },
  bookedSeats: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
