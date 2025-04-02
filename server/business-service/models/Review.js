const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResponseSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  responseDate: {
    type: Date,
    default: Date.now
  }
});

const ReviewSchema = new Schema({
  businessProfile: {
    type: Schema.Types.ObjectId,
    ref: 'BusinessProfile',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  sentiment: {
    score: {
      type: Number,
      default: 0 // -1 to 1 range, where -1 is negative, 0 is neutral, 1 is positive
    },
    label: {
      type: String,
      enum: ['Negative', 'Neutral', 'Positive'],
      default: 'Neutral'
    }
  },
  responses: [ResponseSchema],
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
ReviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);