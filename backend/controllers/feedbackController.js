const feedbackModel = require('../models/feedbackModel');
const logModel = require('../models/logModel');
const ticketModel = require('../models/ticketModel');

exports.submitFeedback = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const { rating, comments } = req.body;
    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }

    await feedbackModel.createFeedback({ ticket_id: ticketId, rating, comments });
    await logModel.addLog({
      ticket_id: ticketId,
      action: `Feedback submitted: ${rating} stars`,
      action_by: req.user.id
    });

    await ticketModel.updateTicketStatus(ticketId, 'Closed');

    const io = req.app.get('io');
    if (io) {
      io.emit('ticket_updated', { action: 'closed', ticketId, status: 'Closed' });
    }

    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to submit feedback', error: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedback = await feedbackModel.getFeedbackByTicket(req.params.ticketId);
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load feedback', error: error.message });
  }
};
