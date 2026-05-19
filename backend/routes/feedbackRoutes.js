const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');

const router = express.Router();

router.post('/:ticketId', verifyToken, submitFeedback);
router.get('/:ticketId', verifyToken, getFeedback);

module.exports = router;
