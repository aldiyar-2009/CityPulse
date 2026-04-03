const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  sportType: { type: String, required: true }, // unique field: Football, Basketball, etc
  teams: { type: [String], required: true }, // unique field: e.g. ["Astana", "Kairat"]
  league: { type: String, required: true }, // unique field
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

module.exports = mongoose.model('Sport', sportSchema);
