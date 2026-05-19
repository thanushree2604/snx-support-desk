const aiService = require('../services/aiService');

exports.suggestIssue = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title && !description) {
      return res.status(400).json({ message: 'Title or description is required for AI suggestions' });
    }
    const suggestion = await aiService.analyzeIssue({ title, description });
    res.json(suggestion);
  } catch (error) {
    res.status(500).json({ message: 'Unable to generate AI suggestions', error: error.message });
  }
};

exports.chatReply = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message text is required for the AI chatbot' });
    }
    const reply = await aiService.chatReply(message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: 'Unable to generate AI chat response', error: error.message });
  }
};
