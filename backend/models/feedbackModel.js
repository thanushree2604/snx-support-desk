const db = require('../config/db');

exports.createFeedback = async ({ ticket_id, rating, comments }) => {
  const [result] = await db.query(
    'INSERT INTO feedback (ticket_id, rating, comments) VALUES (?, ?, ?)',
    [ticket_id, rating, comments]
  );
  return { id: result.insertId };
};

exports.getFeedbackByTicket = async (ticketId) => {
  const [rows] = await db.query('SELECT id, ticket_id, rating, comments, submitted_at FROM feedback WHERE ticket_id = ?', [ticketId]);
  return rows;
};

exports.getRatingsSummary = async () => {
  const [rows] = await db.query(
    `SELECT
      AVG(rating) AS average_rating,
      SUM(rating >= 4) AS excellent,
      SUM(rating = 3) AS good,
      SUM(rating <= 2) AS improvement_needed,
      COUNT(*) AS total_feedback
     FROM feedback`
  );
  return rows[0];
};
