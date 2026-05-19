const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const {
  createTicket,
  getMyTickets,
  getAssignedTickets,
  getTicketDetails,
  getTicketHistory,
  getTicketStats,
  addTicketMessage,
  getActiveChatTickets
} = require('../controllers/ticketController');
const router = express.Router();

router.post('/', verifyToken, createTicket);
router.get('/mine', verifyToken, getMyTickets);
router.get('/stats', verifyToken, getTicketStats);
router.get('/assigned', verifyToken, getAssignedTickets);
router.get('/chat-tickets', verifyToken, getActiveChatTickets);
router.get('/:ticketId', verifyToken, getTicketDetails);
router.get('/:ticketId/history', verifyToken, getTicketHistory);
router.post('/:ticketId/chat', verifyToken, addTicketMessage);

module.exports = router;
