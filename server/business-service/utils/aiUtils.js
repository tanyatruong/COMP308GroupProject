const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes the sentiment of text using Gemini API
 * @param {string} text - The text to analyze
 * @returns {Object} - Sentiment analysis results with score and label
 */
const analyzeSentiment = async (text) => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prompt for sentiment analysis
    const prompt = `
      Analyze the sentiment of the following text and provide a score between -1 and 1, 
      where -1 is very negative, 0 is neutral, and 1 is very positive. 
      Also provide a label of either "Negative", "Neutral", or "Positive".
      
      Text: "${text}"
      
      Please respond in JSON format like:
      {
        "score": 0.7,
        "label": "Positive"
      }
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to extract JSON from Gemini response');
      return { score: 0, label: 'Neutral' };
    }

    const sentimentData = JSON.parse(jsonMatch[0]);
    return {
      score: sentimentData.score,
      label: sentimentData.label
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    // Return neutral sentiment on error
    return {
      score: 0,
      label: 'Neutral'
    };
  }
};

/**
 * Generates a summary of long text using Gemini API
 * @param {string} text - The text to summarize
 * @param {number} maxLength - Maximum length of the summary in words
 * @returns {string} - Summarized text
 */
const generateSummary = async (text, maxLength = 100) => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prompt for text summarization
    const prompt = `
      Summarize the following text in approximately ${maxLength} words or less:
      
      "${text}"
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Summary unavailable.';
  }
};

module.exports = {
  analyzeSentiment,
  generateSummary
};