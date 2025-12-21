const Review = require('../models/Review');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

// @desc    Submit a review
// @route   POST /api/reviews/submit
// @access  Private
exports.submitReview = async (req, res) => {
  const { assignmentId, strengths, weaknesses, suggestions, ratings } = req.body;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if reviewer is owner
    if (assignment.submittedBy.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot review your own assignment' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ assignmentId, reviewerId: req.user.id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this assignment' });
    }

    const review = new Review({
      assignmentId,
      reviewerId: req.user.id,
      strengths,
      weaknesses,
      suggestions,
      ratings
    });

    await review.save();

    // Side Effects
    
    // 1. Update Assignment
    assignment.receivedReviewsCount = (assignment.receivedReviewsCount || 0) + 1;
    if (assignment.receivedReviewsCount >= assignment.requiredReviews) {
        assignment.status = 'reviewed';
    }
    await assignment.save();

    // 2. Update User (Reviewer) - Points +10, reviewedCount + 1
    // 2. Update User (Reviewer) - Points +10, reviewedCount + 1
    // Use atomic update first to ensure count is accurate
    let reviewer = await User.findByIdAndUpdate(req.user.id, { 
        $inc: { points: 10, reviewedCount: 1 } 
    }, { new: true });

    // Badge Logic
    const badges = reviewer.badges || [];
    let badgeAdded = false;

    if (reviewer.reviewedCount >= 1 && !badges.includes('First Review')) {
        badges.push('First Review');
        badgeAdded = true;
    }
    if (reviewer.reviewedCount >= 10 && !badges.includes('Active Reviewer')) {
        badges.push('Active Reviewer');
        badgeAdded = true;
    }
    if (reviewer.points >= 200 && !badges.includes('Top Contributor')) {
        badges.push('Top Contributor');
        badgeAdded = true;
    }
    
    if (badgeAdded) {
        await User.findByIdAndUpdate(req.user.id, { badges: badges });
    }

    res.status(201).json({ message: 'Review submitted successfully', review });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get reviews for an assignment
// @route   GET /api/reviews/assignment/:id
// @access  Private
exports.getReviewsForAssignment = async (req, res) => {
    try {
        const reviews = await Review.find({ assignmentId: req.params.id }).sort({ createdAt: -1 });
        
        // Mask reviewer identity
        const maskedReviews = reviews.map((review, index) => ({
            ...review._doc,
            reviewerId: undefined, // Hide ID
            reviewerName: `Anonymous #${index + 1}`
        }));

        res.json(maskedReviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Rate review usefulness
// @route   POST /api/reviews/rate
// @access  Private (Assignment Owner)
exports.rateReviewUsefulness = async (req, res) => {
    const { reviewId, useful } = req.body;

    try {
        const review = await Review.findById(reviewId).populate('assignmentId');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if requester is the assignment owner
        if (review.assignmentId.submittedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to rate this review' });
        }

        if (useful) {
            review.usefulnessScore += 1;
            await review.save();

            // Give points to reviewer (+5) and increment helpfulReviewsCount
            // Give points to reviewer (+5) and increment helpfulReviewsCount
            // Atomic update
            let reviewer = await User.findByIdAndUpdate(review.reviewerId, {
                $inc: { points: 5, helpfulReviewsCount: 1 }
            }, { new: true });

            if (reviewer) {
                // Badge Logic for Helpful Critic
                const badges = reviewer.badges || [];
                let badgeAdded = false;

                if (reviewer.helpfulReviewsCount >= 5 && !badges.includes('Helpful Critic')) {
                    badges.push('Helpful Critic');
                    badgeAdded = true;
                }
                // Check Top Contributor again just in case
                if (reviewer.points >= 200 && !badges.includes('Top Contributor')) {
                    badges.push('Top Contributor');
                    badgeAdded = true;
                }
                
                if (badgeAdded) {
                     await User.findByIdAndUpdate(review.reviewerId, { badges: badges });
                }
            }
        }

        res.json({ message: 'Review rated successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
