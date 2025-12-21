const Assignment = require('../models/Assignment');
const Review = require('../models/Review');

// @desc    Create a new assignment
// @route   POST /api/assignments/create
// @access  Private (Student)
exports.createAssignment = async (req, res) => {
  const { title, description, fileUrl, requiredReviews } = req.body;

  try {
    // Determine if this is a file upload or a link
    const uploadType = req.file ? 'upload' : 'link';
    const filePath = req.file ? req.file.path : null;

    const newAssignment = new Assignment({
      title,
      description,
      fileUrl: uploadType === 'link' ? fileUrl : null,
      filePath: uploadType === 'upload' ? filePath : null,
      uploadType,
      requiredReviews: requiredReviews || 3,
      submittedBy: req.user.id,
      status: 'pending'
    });

    const assignment = await newAssignment.save();
    
    // Increment createdAssignmentsCount for user
    await require('../models/User').findByIdAndUpdate(req.user.id, { $inc: { createdAssignmentsCount: 1 } });

    res.status(201).json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all assignments submitted by logged in user
// @route   GET /api/assignments/my
// @access  Private
exports.getMyAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ submittedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get assignments to review
// @route   GET /api/assignments/to-review
// @access  Private
exports.getAssignmentsToReview = async (req, res) => {
  try {
    // Get list of assignments already reviewed by this user
    const reviewedAssignments = await Review.find({ reviewerId: req.user.id }).select('assignmentId');
    const reviewedIds = reviewedAssignments.map(r => r.assignmentId);

    // Find assignments NOT submitted by user AND NOT already reviewed by user
    const assignments = await Assignment.find({
      submittedBy: { $ne: req.user.id },
      _id: { $nin: reviewedIds },
      status: { $ne: 'reviewed' } // Optional: Don't show fully reviewed assignments? Prompt says "prefer assignments needing reviews". Let's show all valid ones pending more reviews.
    }).sort({ receivedReviewsCount: 1 }); // Prioritize those with fewer reviews

    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('submittedBy', 'name');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Download assignment file
// @route   GET /api/assignments/download/:id
// @access  Private
exports.downloadAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.uploadType !== 'upload' || !assignment.filePath) {
      return res.status(400).json({ message: 'This assignment does not have an uploaded file' });
    }

    const path = require('path');
    const fs = require('fs');
    
    // Check if file exists
    if (!fs.existsSync(assignment.filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Send file
    res.download(assignment.filePath, path.basename(assignment.filePath));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(500).send('Server Error');
  }
};

