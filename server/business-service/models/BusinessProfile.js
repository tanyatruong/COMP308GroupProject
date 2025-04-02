const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusinessProfileSchema = new Schema({
  businessName: {
    type: String,
    required: true
  },
  businessOwner: {
    type: Schema.Types.ObjectId,
    ref: 'BusinessOwner',
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    }
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  businessTags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the updatedAt field
BusinessProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BusinessProfile', BusinessProfileSchema);