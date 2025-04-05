const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

/**
 * AI-based volunteer matching service for events
 * This service simulates using AI to match volunteers to events based on:
 * 1. Residents' interests matching event tags
 * 2. Residents' location proximity to event location
 * 3. Residents' previous event participation history
 * 4. Availability patterns based on past participation
 * 
 * In a production implementation, this would use a real ML model through the Gemini API
 */

// Simulated function to match volunteers with events
const findVolunteersForEvent = async (event, allResidents) => {
  try {
    // In production, this would call the Gemini API for more sophisticated matching
    // const response = await axios.post('https://ai.google.dev/api/volunteer-matching', {
    //   eventTags: event.tags,
    //   eventLocation: event.location,
    //   eventTiming: {
    //     startDate: event.startDate,
    //     endDate: event.endDate
    //   }
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    
    // For this implementation, we'll do a simple interest-based matching
    const matchedVolunteers = [];
    
    for (const resident of allResidents) {
      let score = 0;
      
      // Interest matching
      for (const tag of event.tags) {
        if (resident.interests && resident.interests.includes(tag)) {
          score += 2;
        }
      }
      
      // Previous event participation (simple heuristic)
      if (resident.previousEvents && resident.previousEvents.length > 0) {
        score += 1;
      }
      
      // Location proximity (simplified)
      // In a real implementation, we would calculate actual distance
      if (resident.location && resident.location.toString() === event.location.toString()) {
        score += 3;
      }
      
      // Add to matched volunteers if score is high enough
      if (score >= 3) {
        matchedVolunteers.push({
          residentId: resident._id,
          score
        });
      }
    }
    
    // Sort by score (descending) and limit to top 10
    const topVolunteers = matchedVolunteers
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(match => match.residentId);
      
    return topVolunteers;
  } catch (error) {
    console.error('Error finding volunteers:', error);
    return [];
  }
};

module.exports = {
  findVolunteersForEvent
};