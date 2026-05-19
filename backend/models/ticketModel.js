const db = require('../config/db');

exports.createTicket = async (ticket) => {
  const [result] = await db.query(
    'INSERT INTO tickets (user_id, category_id, title, description, priority, status) VALUES (?, ?, ?, ?, ?, ?)',
    [ticket.user_id, ticket.category_id, ticket.title, ticket.description, ticket.priority, ticket.status || 'Open']
  );
  return { id: result.insertId };
};

exports.getTicketById = async (ticketId) => {
  const [rows] = await db.query(
    `SELECT t.*, u.name AS requester, c.category_name AS category, s.name AS assigned_staff
     FROM tickets t
     LEFT JOIN users u ON t.user_id = u.id
     LEFT JOIN categories c ON t.category_id = c.id
     LEFT JOIN users s ON t.assigned_staff_id = s.id
     WHERE t.id = ?`,
    [ticketId]
  );
  return rows[0];
};

exports.getTicketsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT t.*, c.category_name AS category, s.name AS assigned_staff
     FROM tickets t
     LEFT JOIN categories c ON t.category_id = c.id
     LEFT JOIN users s ON t.assigned_staff_id = s.id
     WHERE t.user_id = ? ORDER BY t.updated_at DESC`,
    [userId]
  );
  return rows;
};

exports.getAssignedTickets = async (staffId) => {
  const [rows] = await db.query(
    `SELECT t.*, c.category_name AS category, u.name AS requester
     FROM tickets t
     LEFT JOIN categories c ON t.category_id = c.id
     LEFT JOIN users u ON t.user_id = u.id
     WHERE t.assigned_staff_id = ? ORDER BY t.updated_at DESC`,
    [staffId]
  );
  return rows;
};

exports.listAllTickets = async (filters = {}) => {
  const conditions = [];
  const values = [];

  if (filters.status) {
    conditions.push('t.status = ?');
    values.push(filters.status);
  }
  if (filters.category_id) {
    conditions.push('t.category_id = ?');
    values.push(filters.category_id);
  }
  if (filters.assigned_staff_id) {
    conditions.push('t.assigned_staff_id = ?');
    values.push(filters.assigned_staff_id);
  }
  if (filters.keyword) {
    conditions.push('(t.title LIKE ? OR t.description LIKE ? OR u.name LIKE ? OR c.category_name LIKE ?)');
    const searchValue = `%${filters.keyword}%`;
    values.push(searchValue, searchValue, searchValue, searchValue);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await db.query(
    `SELECT t.*, u.name AS requester, c.category_name AS category, s.name AS assigned_staff
     FROM tickets t
     LEFT JOIN users u ON t.user_id = u.id
     LEFT JOIN categories c ON t.category_id = c.id
     LEFT JOIN users s ON t.assigned_staff_id = s.id
     ${whereClause}
     ORDER BY t.updated_at DESC`,
    values
  );
  return rows;
};

exports.getUserTicketCounts = async (userId) => {
  const [rows] = await db.query(
    `SELECT
      CAST(SUM(t.status = 'Open') AS UNSIGNED) AS open_count,
      CAST(SUM(t.status = 'Assigned') AS UNSIGNED) AS assigned_count,
      CAST(SUM(t.status = 'In Progress') AS UNSIGNED) AS in_progress_count,
      CAST(SUM(t.status = 'Resolved') AS UNSIGNED) AS resolved_count,
      CAST(SUM(t.status = 'Closed') AS UNSIGNED) AS closed_count,
      CAST(COUNT(*) AS UNSIGNED) AS total_count
     FROM tickets t
     WHERE t.user_id = ?`,
    [userId]
  );
  return rows[0] || {
    open_count: 0,
    assigned_count: 0,
    in_progress_count: 0,
    resolved_count: 0,
    closed_count: 0,
    total_count: 0
  };
};

exports.assignTicket = async (ticketId, staffId) => {
  await db.query('UPDATE tickets SET assigned_staff_id = ?, status = ? WHERE id = ?', [staffId, 'Assigned', ticketId]);
};

exports.updateTicketStatus = async (ticketId, status) => {
  await db.query('UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, ticketId]);
};

exports.updateTicketPriority = async (ticketId, priority) => {
  await db.query('UPDATE tickets SET priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [priority, ticketId]);
};

exports.getTicketCounts = async () => {
  const [rows] = await db.query(
    `SELECT
      CAST(SUM(status = 'Open') AS UNSIGNED) AS open_count,
      CAST(SUM(status = 'Assigned') AS UNSIGNED) AS assigned_count,
      CAST(SUM(status = 'In Progress') AS UNSIGNED) AS in_progress_count,
      CAST(SUM(status = 'Resolved') AS UNSIGNED) AS resolved_count,
      CAST(SUM(status = 'Closed') AS UNSIGNED) AS closed_count,
      CAST(COUNT(*) AS UNSIGNED) AS total_count
     FROM tickets`
  );
  return rows[0] || {
    open_count: 0,
    assigned_count: 0,
    in_progress_count: 0,
    resolved_count: 0,
    closed_count: 0,
    total_count: 0
  };
};

exports.getCategoryPerformance = async () => {
  const [rows] = await db.query(
    `SELECT c.category_name,
      COUNT(t.id) AS total_tickets,
      SUM(t.status = 'Resolved') AS resolved,
      SUM(t.status <> 'Resolved') AS pending
     FROM tickets t
     LEFT JOIN categories c ON t.category_id = c.id
     GROUP BY c.category_name
     ORDER BY total_tickets DESC`
  );
  return rows;
};

exports.getStaffPerformance = async () => {
  const [rows] = await db.query(
    `SELECT u.name AS staff_name,
      COUNT(t.id) AS assigned_tickets,
      SUM(t.status = 'Resolved') AS resolved_tickets,
      SUM(t.status <> 'Resolved') AS open_tickets
     FROM tickets t
     LEFT JOIN users u ON t.assigned_staff_id = u.id
     WHERE t.assigned_staff_id IS NOT NULL
     GROUP BY u.name
     ORDER BY resolved_tickets DESC`
  );
  return rows;
};
