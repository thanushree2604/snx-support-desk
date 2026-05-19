const categoryModel = require('../models/categoryModel');

exports.listCategories = async (req, res) => {
  try {
    const categories = await categoryModel.listCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load categories', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    const category = await categoryModel.createCategory(category_name);
    res.status(201).json({ message: 'Category created', id: category.id });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create category', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    const categoryId = req.params.categoryId;
    await categoryModel.updateCategory(categoryId, category_name);
    res.json({ message: 'Category updated' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update category', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    await categoryModel.deleteCategory(categoryId);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete category', error: error.message });
  }
};
