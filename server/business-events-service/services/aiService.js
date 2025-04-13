const fetch = require('node-fetch');

const aiServiceEndpoint = 'http://localhost:4003/graphql';

// Function to analyze sentiment of review content
async function analyzeReviewSentiment(reviewContent) {
  const query = `
    query {
      analyzeSentiment(reviews: ["${reviewContent.replace(/"/g, '\\"')}"]) 
    }
  `;
  
  try {
    const response = await fetch(aiServiceEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('Error from AI service:', data.errors);
      return { 
        sentimentScore: null, 
        sentimentAnalysis: null 
      };
    }
    
    // Parse the sentiment score based on the response text
    let sentimentScore = 5.0; // Default neutral score
    const sentimentText = data.data.analyzeSentiment;
    
    if (sentimentText.toLowerCase().includes('very positive')) {
      sentimentScore = 9.0;
    } else if (sentimentText.toLowerCase().includes('positive')) {
      sentimentScore = 7.0;
    } else if (sentimentText.toLowerCase().includes('neutral')) {
      sentimentScore = 5.0;
    } else if (sentimentText.toLowerCase().includes('negative')) {
      sentimentScore = 3.0;
    } else if (sentimentText.toLowerCase().includes('very negative')) {
      sentimentScore = 1.0;
    }
    
    return {
      sentimentScore,
      sentimentAnalysis: sentimentText
    };
  } catch (error) {
    console.error('Error calling AI service for sentiment analysis:', error);
    return { 
      sentimentScore: null, 
      sentimentAnalysis: null 
    };
  }
}

// Function to get AI-suggested time for an event
async function suggestEventTime(title, tags) {
  const query = `
    query {
      suggestEventTime(title: "${title.replace(/"/g, '\\"')}", tags: [${tags.map(tag => `"${tag.replace(/"/g, '\\"')}"`).join(', ')}])
    }
  `;
  
  try {
    const response = await fetch(aiServiceEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('Error from AI service:', data.errors);
      return "No suggestion available";
    }
    
    return data.data.suggestEventTime || "No suggestion available";
  } catch (error) {
    console.error('Error calling AI service for event time suggestion:', error);
    return "Error generating suggestion";
  }
}

module.exports = {
  analyzeReviewSentiment,
  suggestEventTime
};