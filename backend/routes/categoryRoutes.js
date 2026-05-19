const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

router.get('/', verifyToken, listCategories);
router.post('/', verifyToken, verifyAdmin, createCategory);
router.patch('/:categoryId', verifyToken, verifyAdmin, updateCategory);
router.delete('/:categoryId', verifyToken, verifyAdmin, deleteCategory);

module.exports = router;
