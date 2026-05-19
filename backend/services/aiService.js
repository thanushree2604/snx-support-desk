const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const CATEGORY_KEYWORDS = {
  'Network': ['wifi', 'internet', 'network', 'router', 'latency', 'connection', 'dns', 'speed'],
  'Hardware': ['printer', 'keyboard', 'monitor', 'screen', 'battery', 'charger', 'hardware', 'cable', 'device'],
  'Software': ['app', 'software', 'update', 'crash', 'error', 'bug', 'install', 'login', 'program', 'feature'],
  'Access Management': ['password', 'login', 'access', 'permission', 'account', 'authorization', 'reset', 'blocked']
};

const PRIORITY_KEYWORDS = {
  Urgent: ['urgent', 'asap', 'immediately', 'down', 'failure', 'outage', 'cannot', 'critical'],
  High: ['important', 'major', 'high', 'serious', 'unable', 'broken', 'error'],
  Medium: ['issue', 'problem', 'slow', 'delay', 'intermittent'],
  Low: ['minor', 'question', 'request', 'suggestion', 'help']
};

const SENTIMENT_KEYWORDS = {
  negative: ['angry', 'frustrated', 'urgent', 'immediately', 'cannot', 'unable', 'not working', 'broken', 'failure', 'outage', 'delay', 'critically'],
  positive: ['thanks', 'thank you', 'resolved', 'working', 'good', 'great', 'happy', 'fixed']
};

const RESOURCE_TIPS = [
  {
    pattern: /wi[- ]?fi|internet|network|router|dns/i,
    suggestion: 'Restart your router, verify cables, and test on another device. If the issue persists, clear DNS cache or switch networks.'
  },
  {
    pattern: /password|login|access|account|permission/i,
    suggestion: 'Try resetting your password or checking account permissions. If you are still locked out, contact support with your username.'
  },
  {
    pattern: /crash|error|bug|update|install|software/i,
    suggestion: 'Update the software to the latest version and restart your device. Save any work before retrying the action.'
  },
  {
    pattern: /printer|monitor|keyboard|battery|charger|hardware|device/i,
    suggestion: 'Inspect hardware connections, restart the device, and ensure all drivers are up to date. Replace cables if necessary.'
  }
];

const normalizeText = (text) => (text || '').toLowerCase().trim();

const countMatches = (text, keywords) => keywords.reduce((count, keyword) => {
  const regex = new RegExp(`\\b${keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
  return count + (text.match(regex)?.length || 0);
}, 0);

const detectCategory = (text) => {
  const normalized = normalizeText(text);
  const scores = Object.entries(CATEGORY_KEYWORDS).map(([category, keywords]) => ({
    category,
    score: countMatches(normalized, keywords)
  }));
  scores.sort((a, b) => b.score - a.score);
  return scores[0].score > 0 ? scores[0].category : 'Software';
};

const detectPriority = (text) => {
  const normalized = normalizeText(text);
  if (countMatches(normalized, PRIORITY_KEYWORDS.Urgent) > 0) return 'Urgent';
  if (countMatches(normalized, PRIORITY_KEYWORDS.High) > 0) return 'High';
  if (countMatches(normalized, PRIORITY_KEYWORDS.Medium) > 0) return 'Medium';
  return 'Low';
};

const detectSentiment = (text) => {
  const normalized = normalizeText(text);
  const negativeScore = countMatches(normalized, SENTIMENT_KEYWORDS.negative);
  const positiveScore = countMatches(normalized, SENTIMENT_KEYWORDS.positive);
  if (negativeScore > positiveScore && negativeScore >= 1) return 'Negative';
  if (positiveScore > negativeScore) return 'Positive';
  return 'Neutral';
};

const extractSuggestions = (text) => {
  const suggestions = RESOURCE_TIPS
    .filter((item) => item.pattern.test(text))
    .map((item) => item.suggestion);

  if (suggestions.length) {
    return [...new Set(suggestions)];
  }

  return [
    'Describe the issue clearly, including steps to reproduce it and any error messages.',
    'If this is a login issue, try resetting your password before submitting a ticket.',
    'For network issues, restart the router and verify the connection on another device.'
  ];
};

const formatResponse = ({ title, description }) => {
  const text = `${title || ''} ${description || ''}`.trim();
  const categoryName = detectCategory(text);
  const priority = detectPriority(text);
  const sentiment = detectSentiment(text);
  const suggestions = extractSuggestions(text);
  const botReply = suggestions[0] || 'Let me know more about the issue and I will suggest the next step.';

  return {
    categoryName,
    priority,
    sentiment,
    suggestions,
    botReply
  };
};

const createOpenAIReply = async (prompt) => {
  if (!OPENAI_API_KEY) {
    return null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        input: prompt,
        max_output_tokens: 250
      })
    });

    const data = await response.json();
    const text = data?.output?.[0]?.content?.[0]?.text || data?.output?.[0]?.content || null;
    return text ? String(text).trim() : null;
  } catch (error) {
    return null;
  }
};

exports.analyzeIssue = async ({ title, description }) => {
  const base = formatResponse({ title, description });
  const prompt = `You are a support assistant. Suggest the best category, priority, and first troubleshooting step for this issue. Issue title: ${title || 'N/A'}. Description: ${description || 'N/A'}.`;
  const openAiText = await createOpenAIReply(prompt);

  if (openAiText) {
    return {
      ...base,
      botReply: openAiText
    };
  }

  return base;
};

exports.chatReply = async (message) => {
  const prompt = `You are a helpful support chatbot. The user asked: "${message}". Give a concise troubleshooting response or ask a clarifying question.`;
  const openAiText = await createOpenAIReply(prompt);
  if (openAiText) {
    return openAiText;
  }

  const normalized = normalizeText(message);
  const suggestions = extractSuggestions(normalized);
  return suggestions[0] || 'Please provide more details so I can help you resolve the issue.';
};
