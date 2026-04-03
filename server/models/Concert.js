const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  artist: { type: String, required: true }, // unique field
  genre: { type: String, required: true }, // unique field
  supportAct: { type: String, default: '' }, // unique field
  rating: { type: Number, default: 0, min: 0, max: 5 },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  poster: { type: String, required: true },
  backdrop: { type: String, default: '' },
  age: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  ticketsAvailable: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Concert', concertSchema);
