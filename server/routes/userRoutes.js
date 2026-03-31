const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, addBalance } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.post('/balance', protect, addBalance);

module.exports = router;
