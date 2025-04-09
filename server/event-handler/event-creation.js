// Importing the event object template
const eventTemplate = require('./event');

// Function to check if the user is logged in
function isLoggedIn(user) {
    return user && user.isLoggedIn;
}

// Function to create a new event
function createEvent(user, data) {
    if (!isLoggedIn(user)) {
        throw new Error("User must be logged in to create an event.");
    }

    const newEvent = {
        ...eventTemplate,
        title: data.title || eventTemplate.title,
        description: data.description || eventTemplate.description,
        startDate: data.startDate ? new Date(data.startDate) : eventTemplate.startDate,
        endDate: data.endDate ? new Date(data.endDate) : eventTemplate.endDate,
        location: {
            address: data.location?.address || eventTemplate.location.address,
            city: data.location?.city || eventTemplate.location.city,
            state: data.location?.state || eventTemplate.location.state,
            country: data.location?.country || eventTemplate.location.country,
        },
        tags: Array.isArray(data.tags) ? data.tags : eventTemplate.tags,
    };

    return newEvent;
}

// Example usage
const exampleUser = { username: "tyler_mercier", isLoggedIn: true }; // Simulated logged-in user
const exampleEventData = {
    title: "Admin Meetup",
    description: "A meeting among admins to discuss the recent rule breaking of mr. Ben Dover.",
    startDate: "2025-05-15",
    endDate: "2025-05-15",
    location: {
        address: "Virtual",
        city: "Virtual",
        state: "Virtual",
        country: "Virtual",
    },
    tags: ["admin-only", "virtual", "meeting", "important"],
};

try {
    const newEvent = createEvent(exampleUser, exampleEventData);
    console.log(newEvent);
} catch (error) {
    console.error(error.message);
}

// Exporting the createEvent function
module.exports = createEvent;