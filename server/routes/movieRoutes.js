const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { createHandlers } = require('../controllers/baseController');
const { protect, admin } = require('../middleware/auth');

const handlers = createHandlers(Movie, 'Movie');

router.get('/', handlers.getAll);
router.get('/:id', handlers.getById);
router.post('/purchase', protect, handlers.purchaseTicket);
router.post('/favorite', protect, handlers.toggleFavorite);
router.post('/', protect, admin, handlers.create);
router.put('/:id', protect, admin, handlers.update);
router.delete('/:id', protect, admin, handlers.delete);

module.exports = router;
