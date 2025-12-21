const User = require('../models/User');
const Review = require('../models/Review');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all reviews (for moderation)
// @route   GET /api/admin/reviews
// @access  Admin
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('assignmentId', 'title')
            .populate('reviewerId', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:id
// @access  Admin
exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- User Management ---
exports.updateUserRole = async (req, res) => {
    const { userId, role } = req.body;
    try {
        await User.findByIdAndUpdate(userId, { role });
        res.json({ message: 'User role updated' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateUserStatus = async (req, res) => {
    const { userId, status } = req.body;
    try {
        await User.findByIdAndUpdate(userId, { status });
        res.json({ message: 'User status updated' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.adjustUserPoints = async (req, res) => {
    const { userId, points } = req.body;
    try {
        await User.findByIdAndUpdate(userId, { points });
        res.json({ message: 'User points updated' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// --- Review Moderation ---
exports.flagReview = async (req, res) => {
    const { reviewId, reason } = req.body;
    try {
        await Review.findByIdAndUpdate(reviewId, { flagged: true, flagReason: reason });
        res.json({ message: 'Review flagged' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// --- Analytics ---
exports.getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalInstructors = await User.countDocuments({ role: 'instructor' });
        const totalReviews = await Review.countDocuments();
        const flaggedReviews = await Review.countDocuments({ flagged: true });
        

        // Dynamic engagement data (Last 7 Days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push(d);
        }

        const engagementData = await Review.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 7))
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            }
        ]);

        const engagement = last7Days.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const found = engagementData.find(e => e._id === dateStr);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            return { name: dayName, active: found ? found.count : 0 };
        });

        res.json({
            overview: { totalUsers, totalStudents, totalInstructors, totalReviews, flaggedReviews },
            engagement
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
