const User = require('../models/User');

// @desc    Get user stats and badges
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Calculate Rank (simple count of users with more points + 1)
    const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;

    res.json({
        ...user._doc,
        rank
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
        .sort({ points: -1 })
        .limit(20)
        .select('name points helpfulReviewsCount reviewedCount badges');
    
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
