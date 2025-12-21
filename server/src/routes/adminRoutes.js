const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { 
    getAllUsers, getAllReviews, deleteReview, 
    updateUserRole, updateUserStatus, adjustUserPoints,
    flagReview, getAnalytics 
} = require('../controllers/adminController');

// Protect all routes
router.use(auth);
router.use(role(['admin']));

router.get('/users', getAllUsers);
router.patch('/users/role', updateUserRole);
router.patch('/users/status', updateUserStatus);
router.post('/users/points', adjustUserPoints);

router.get('/reviews', getAllReviews);
router.post('/reviews/flag', flagReview);
router.delete('/reviews/:id', deleteReview);

router.get('/analytics', getAnalytics);

module.exports = router;
