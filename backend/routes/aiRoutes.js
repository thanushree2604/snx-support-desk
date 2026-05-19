const express = require('express');
const { suggestIssue, chatReply } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/suggest', verifyToken, suggestIssue);
router.post('/chat', verifyToken, chatReply);

module.exports = router;
