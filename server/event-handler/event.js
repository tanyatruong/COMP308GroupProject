// Creating an object named "event"
const event = {
    author: "Community Organizer",
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    location: {
        address: "",
        city: "",
        state: "",
        country: ""
    },
    tags: []
};

// Exporting the event object for use in other modules
module.exports = event;