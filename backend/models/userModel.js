const db = require('../config/db');

exports.findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase()]);
  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (user) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [user.name, user.email, user.password, user.role || 'user']
  );
  return { id: result.insertId };
};

exports.list = async () => {
  const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
  return rows;
};

exports.updateRole = async (id, role) => {
  await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
};

exports.updatePassword = async (id, password) => {
  await db.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
};

exports.delete = async (id) => {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
};
