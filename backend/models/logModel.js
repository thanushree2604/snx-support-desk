const db = require('../config/db');

exports.addLog = async ({ ticket_id, action, action_by }) => {
  const [result] = await db.query(
    'INSERT INTO logs (ticket_id, action, action_by) VALUES (?, ?, ?)',
    [ticket_id, action, action_by]
  );
  return { id: result.insertId };
};

exports.getLogsByTicket = async (ticketId) => {
  const [rows] = await db.query(
    `SELECT l.id, l.ticket_id, l.action, l.action_by, l.timestamp, u.name AS actor
     FROM logs l
     LEFT JOIN users u ON l.action_by = u.id
     WHERE l.ticket_id = ?
     ORDER BY l.timestamp ASC`,
    [ticketId]
  );
  return rows;
};

exports.listLogs = async () => {
  const [rows] = await db.query(
    `SELECT l.*, u.name AS actor, t.title AS ticket_title
     FROM logs l
     LEFT JOIN users u ON l.action_by = u.id
     LEFT JOIN tickets t ON l.ticket_id = t.id
     ORDER BY l.timestamp DESC`);
  return rows;
};
