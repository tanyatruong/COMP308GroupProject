const fetch = require('node-fetch');

const aiServiceEndpoint = 'http://localhost:4003/graphql';

// Function to find volunteer matches using AI for an event
async function findVolunteersForEvent(event, residents) {
  // If you're using real residents from the database, 
  // you can replace the mock implementation here
  
  // Extract the city from the event's location
  const city = event.location.city;
  
  const query = `
    query {
      suggestEventVolunteers(
        tags: [${event.tags.map(tag => `"${tag.replace(/"/g, '\\"')}"`).join(', ')}], 
        city: "${city.replace(/"/g, '\\"')}"
      ) {
        id
        username
        interests
      }
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
      
      // Fallback to basic matching if AI service fails
      return fallbackVolunteerMatching(event, residents);
    }
    
    // Extract just the IDs from the response
    return data.data.suggestEventVolunteers.map(volunteer => volunteer.id);
  } catch (error) {
    console.error('Error calling AI service for volunteer suggestions:', error);
    
    // Fallback to basic matching if AI service fails
    return fallbackVolunteerMatching(event, residents);
  }
}

// A simple fallback if the AI service is unavailable
function fallbackVolunteerMatching(event, residents) {
  return residents
    .filter(resident => {
      // Match based on interests
      const hasMatchingInterests = resident.interests.some(interest => 
        event.tags.includes(interest)
      );
      
      // Match based on location
      const isSameLocation = resident.location.toString() === event.location._id.toString();
      
      return hasMatchingInterests && isSameLocation;
    })
    .map(resident => resident._id.toString());
}

// Function to suggest volunteers for help requests
async function findVolunteersForHelpRequest(tags, city) {
  const query = `
    query {
      suggestHelpRequestVolunteers(
        tags: [${tags.map(tag => `"${tag.replace(/"/g, '\\"')}"`).join(', ')}], 
        city: "${city.replace(/"/g, '\\"')}"
      ) {
        id
        username
        interests
      }
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
      return [];
    }
    
    return data.data.suggestHelpRequestVolunteers.map(volunteer => volunteer.id);
  } catch (error) {
    console.error('Error calling AI service for help request volunteer suggestions:', error);
    return [];
  }
}

module.exports = {
  findVolunteersForEvent,
  findVolunteersForHelpRequest
};