const ticketModel = require('../models/ticketModel');
const categoryModel = require('../models/categoryModel');
const feedbackModel = require('../models/feedbackModel');

exports.summary = async (req, res) => {
  try {
    const ticketCounts = await ticketModel.getTicketCounts();
    const categoryList = await categoryModel.listCategories();
    const ratingsSummary = await feedbackModel.getRatingsSummary();
    const topCategories = await ticketModel.getTopCategories();
    const monthlyReport = await ticketModel.getMonthlyTicketCounts();
    const avgResolution = await ticketModel.getAverageResolutionTime();

    res.json({
      ticketCounts,
      categories: categoryList,
      ratingsSummary,
      topCategories,
      monthlyReport,
      avgResolution
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load reports', error: error.message });
  }
};

exports.categoryPerformance = async (req, res) => {
  try {
    const rows = await ticketModel.getCategoryPerformance();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load category analytics', error: error.message });
  }
};

exports.staffPerformance = async (req, res) => {
  try {
    const rows = await ticketModel.getStaffPerformance();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load staff performance', error: error.message });
  }
};
