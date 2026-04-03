require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const sportRoutes = require('./routes/sportRoutes');
const concertRoutes = require('./routes/concertRoutes');
const fairRoutes = require('./routes/fairRoutes');

connectDB();

const app = express();

// CORS — allow configured origins
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/fairs', fairRoutes);

// Root info endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CityPulse API v2.0 (Redesign)',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      movies: '/api/movies',
      sports: '/api/sports',
      concerts: '/api/concerts',
      fairs: '/api/fairs'
    },
  });
});

// 404 handler — unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(err.status || 500).json({
    message: err.message || 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📍 Режим: ${process.env.NODE_ENV || 'development'}`);
});
