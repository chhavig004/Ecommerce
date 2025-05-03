const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  logout
} = require('../controllers/authController');  // Make sure these functions exist
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile
router.get('/profile', protect, getProfile);

// PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

// POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;