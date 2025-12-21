const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getUserStats, getLeaderboard } = require('../controllers/userController');

router.get('/stats', auth, getUserStats);
router.get('/leaderboard', auth, getLeaderboard);

module.exports = router;
