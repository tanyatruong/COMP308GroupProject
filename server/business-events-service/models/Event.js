const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommunityOrganizer',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident'
    }],
    maxParticipants: {
        type: Number
    },
    isCancelled: {
        type: Boolean,
        default: false
    },
    suggestedVolunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident'
    }]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event };