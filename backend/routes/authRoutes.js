const express = require('express');
const {
  register,
  login,
  profile,
  requestPasswordReset,
  resetPassword
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', requestPasswordReset);
router.post('/reset', resetPassword);
router.get('/profile', verifyToken, profile);

module.exports = router;
