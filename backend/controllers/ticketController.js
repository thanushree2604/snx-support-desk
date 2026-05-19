const ticketModel = require('../models/ticketModel');
const logModel = require('../models/logModel');
const categoryModel = require('../models/categoryModel');
const userModel = require('../models/userModel');
const mailer = require('../config/mailer');

exports.createTicket = async (req, res) => {
  try {
    const { title, description, category_id, priority, sentiment } = req.body;
    if (!title || !description || !category_id || !priority) {
      return res.status(400).json({ message: 'All ticket fields are required' });
    }

    const ticket = await ticketModel.createTicket({
      user_id: req.user.id,
      category_id,
      title,
      description,
      priority,
      sentiment,
      status: 'Open'
    });

    await logModel.addLog({
      ticket_id: ticket.id,
      action: 'Ticket created',
      action_by: req.user.id
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('ticket_updated', { action: 'created', ticketId: ticket.id, status: 'Open' });
    }

    const user = await userModel.findById(req.user.id);
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      mailer.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Ticket Created Successfully',
        html: `<p>Your ticket <strong>${title}</strong> was submitted successfully. A support agent will follow up soon.</p>`
      }).catch(() => null);
    }

    res.status(201).json({ message: 'Ticket created successfully', ticketId: ticket.id });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create ticket', error: error.message });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.getTicketsByUser(req.user.id);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch tickets', error: error.message });
  }
};

exports.getAssignedTickets = async (req, res) => {
  try {
    if (req.user.role !== 'support') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const tickets = await ticketModel.getAssignedTickets(req.user.id);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch assigned tickets', error: error.message });
  }
};

exports.getTicketDetails = async (req, res) => {
  try {
    const ticket = await ticketModel.getTicketById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    if (req.user.role === 'user' && ticket.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this ticket' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load ticket', error: error.message });
  }
};

exports.getTicketHistory = async (req, res) => {
  try {
    const logs = await logModel.getLogsByTicket(req.params.ticketId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch ticket history', error: error.message });
  }
};

exports.getTicketStats = async (req, res) => {
  try {
    const stats = await ticketModel.getUserTicketCounts(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch ticket stats', error: error.message });
  }
};

exports.addTicketMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const ticketId = req.params.ticketId;
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    await logModel.addLog({
      ticket_id: ticketId,
      action: content,
      action_by: req.user.id
    });

    res.json({ message: 'Message saved to ticket chat' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to save message', error: error.message });
  }
};

exports.getActiveChatTickets = async (req, res) => {
  try {
    const tickets = req.user.role === 'admin' || req.user.role === 'support'
      ? await ticketModel.listAllTickets({ status: 'Open' })
      : await ticketModel.getTicketsByUser(req.user.id);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch chat tickets', error: error.message });
  }
};
