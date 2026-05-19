const db = require('../config/db');

exports.listCategories = async () => {
  const [rows] = await db.query('SELECT id, category_name FROM categories ORDER BY category_name ASC');
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT id, category_name FROM categories WHERE id = ?', [id]);
  return rows[0];
};

exports.createCategory = async (categoryName) => {
  const [result] = await db.query('INSERT INTO categories (category_name) VALUES (?)', [categoryName]);
  return { id: result.insertId };
};

exports.updateCategory = async (id, categoryName) => {
  await db.query('UPDATE categories SET category_name = ? WHERE id = ?', [categoryName, id]);
};

exports.deleteCategory = async (id) => {
  await db.query('DELETE FROM categories WHERE id = ?', [id]);
};
