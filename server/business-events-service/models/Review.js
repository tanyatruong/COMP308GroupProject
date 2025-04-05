const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    businessProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessProfile',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    sentimentScore: {
        type: Number
    },
    sentimentAnalysis: {
        type: String
    },
    responses: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };