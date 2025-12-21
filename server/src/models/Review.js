const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  strengths: {
    type: String,
  },
  weaknesses: {
    type: String,
  },
  suggestions: {
    type: String,
  },
  ratings: {
    clarity: { type: Number, min: 1, max: 5 },
    quality: { type: Number, min: 1, max: 5 },
    effort: { type: Number, min: 1, max: 5 },
  },
  usefulnessScore: {
    type: Number,
    default: 0,
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  flagReason: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
