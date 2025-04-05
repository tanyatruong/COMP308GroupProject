const mongoose = require('mongoose');

const businessProfileSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true
    },
    businessOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessOwner',
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String]
    },
    offers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    businessTags: {
        type: [String]
    }
}, { timestamps: true });

const BusinessProfile = mongoose.model('BusinessProfile', businessProfileSchema);

module.exports = { BusinessProfile };