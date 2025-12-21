const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
  filePath: {
    type: String,
  },
  uploadType: {
    type: String,
    enum: ['link', 'upload'],
    default: 'link',
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requiredReviews: {
    type: Number,
    default: 3,
  },
  receivedReviewsCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
