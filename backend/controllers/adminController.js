const ticketModel = require('../models/ticketModel');
const userModel = require('../models/userModel');
const categoryModel = require('../models/categoryModel');
const logModel = require('../models/logModel');
const mailer = require('../config/mailer');

exports.listAllTickets = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      category_id: req.query.category_id,
      assigned_staff_id: req.query.assigned_staff_id,
      keyword: req.query.keyword
    };
    const tickets = await ticketModel.listAllTickets(filters);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load tickets', error: error.message });
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const { staffId } = req.body;
    await ticketModel.assignTicket(ticketId, staffId);
    await logModel.addLog({ ticket_id: ticketId, action: `Ticket assigned to staff ID ${staffId}`, action_by: req.user.id });

    const io = req.app.get('io');
    if (io) {
      io.emit('ticket_updated', { action: 'assigned', ticketId, status: 'Assigned' });
    }

    const user = await userModel.findById(staffId);
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD && user) {
      mailer.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'New Ticket Assigned',
        html: `<p>You have been assigned to ticket #${ticketId}. Please review and update the status.</p>`
      }).catch(() => null);
    }

    res.json({ message: 'Ticket assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to assign ticket', error: error.message });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const status = req.body.status;
    await ticketModel.updateTicketStatus(ticketId, status);
    await logModel.addLog({ ticket_id: ticketId, action: `Status updated to ${status}`, action_by: req.user.id });

    const io = req.app.get('io');
    if (io) {
      io.emit('ticket_updated', { action: 'status_changed', ticketId, status });
    }

    res.json({ message: 'Ticket status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update status', error: error.message });
  }
};

exports.updateTicketPriority = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const priority = req.body.priority;
    await ticketModel.updateTicketPriority(ticketId, priority);
    await logModel.addLog({ ticket_id: ticketId, action: `Priority updated to ${priority}`, action_by: req.user.id });
    res.json({ message: 'Ticket priority updated' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update priority', error: error.message });
  }
};

exports.addInternalNote = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ message: 'Note body is required' });
    }
    await logModel.addLog({ ticket_id: ticketId, action: `Internal note: ${note.trim()}`, action_by: req.user.id });
    res.json({ message: 'Internal note added' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add note', error: error.message });
  }
};

exports.uploadAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Attachment is required' });
    }

    const ticketId = req.params.ticketId;
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    await logModel.addLog({
      ticket_id: ticketId,
      action: `Attachment uploaded: ${req.file.originalname}|${url}`,
      action_by: req.user.id
    });

    res.json({ message: 'Attachment uploaded', filename: req.file.originalname, url });
  } catch (error) {
    res.status(500).json({ message: 'Unable to upload attachment', error: error.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await userModel.list();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load users', error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { role } = req.body;
    await userModel.updateRole(userId, role);
    res.json({ message: 'User role updated' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update user role', error: error.message });
  }
};

exports.listLogs = async (req, res) => {
  try {
    const logs = await logModel.listLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load logs', error: error.message });
  }
};

exports.listCategories = async (req, res) => {
  try {
    const categories = await categoryModel.listCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load categories', error: error.message });
  }
};
