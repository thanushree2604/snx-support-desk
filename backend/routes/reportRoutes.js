const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const {
  summary,
  categoryPerformance,
  staffPerformance
} = require('../controllers/reportController');

const router = express.Router();

router.get('/summary', verifyToken, verifyAdmin, summary);
router.get('/category', verifyToken, verifyAdmin, categoryPerformance);
router.get('/staff', verifyToken, verifyAdmin, staffPerformance);

module.exports = router;
