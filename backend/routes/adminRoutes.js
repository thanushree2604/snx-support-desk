const express = require('express');
const multer = require('multer');
const path = require('path');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const {
  listAllTickets,
  assignTicket,
  updateTicketStatus,
  updateTicketPriority,
  addInternalNote,
  uploadAttachment,
  listUsers,
  updateUserRole,
  listLogs,
  listCategories
} = require('../controllers/adminController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${sanitized}`);
  }
});
const upload = multer({ storage });

const router = express.Router();

router.get('/tickets', verifyToken, verifyAdmin, listAllTickets);
router.post('/tickets/:ticketId/assign', verifyToken, verifyAdmin, assignTicket);
router.patch('/tickets/:ticketId/status', verifyToken, verifyAdmin, updateTicketStatus);
router.patch('/tickets/:ticketId/priority', verifyToken, verifyAdmin, updateTicketPriority);
router.post('/tickets/:ticketId/notes', verifyToken, verifyAdmin, addInternalNote);
router.post('/tickets/:ticketId/attachments', verifyToken, verifyAdmin, upload.single('attachment'), uploadAttachment);
router.get('/users', verifyToken, verifyAdmin, listUsers);
router.patch('/users/:userId/role', verifyToken, verifyAdmin, updateUserRole);
router.get('/logs', verifyToken, verifyAdmin, listLogs);
router.get('/categories', verifyToken, verifyAdmin, listCategories);

module.exports = router;
