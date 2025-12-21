const Assignment = require('../models/Assignment');
const Review = require('../models/Review');

// @desc    Get all assignments with stats
// @route   GET /api/instructor/assignments
// @access  Instructor
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Close an assignment
// @route   POST /api/instructor/close-assignment
// @access  Instructor
exports.closeAssignment = async (req, res) => {
    const { assignmentId } = req.body;
    try {
        const assignment = await Assignment.findByIdAndUpdate(
            assignmentId, 
            { status: 'closed' }, 
            { new: true }
        );
        res.json(assignment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Export reviews as CSV
// @route   GET /api/instructor/export/:id
// @access  Instructor
exports.exportReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ assignmentId: req.params.id })
            .populate('reviewerId', 'name')
            .populate('assignmentId', 'title');

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found' });
        }

        // CSV Header
        let csv = 'Assignment,Reviewer,Strengths,Weaknesses,Suggestions,Clarity,Quality,Effort,Usefulness Score\n';

        reviews.forEach(review => {
            const assignmentTitle = review.assignmentId ? review.assignmentId.title : 'N/A';
            const reviewerName = review.reviewerId ? review.reviewerId.name : 'Unknown';
            
            // Escape helper for CSV
            const escape = (text) => `"${(text || '').replace(/"/g, '""')}"`;

            csv += `${escape(assignmentTitle)},${escape(reviewerName)},${escape(review.strengths)},${escape(review.weaknesses)},${escape(review.suggestions)},${review.ratings.clarity},${review.ratings.quality},${review.ratings.effort},${review.usefulnessScore}\n`;
        });

        res.header('Content-Type', 'text/csv');
        res.attachment(`reviews-${req.params.id}.csv`);
        res.send(csv);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
