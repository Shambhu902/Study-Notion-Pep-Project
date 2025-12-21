const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    submitReview, 
    getReviewsForAssignment, 
    rateReviewUsefulness 
} = require('../controllers/reviewController');

router.post('/submit', auth, submitReview);
router.get('/assignment/:id', auth, getReviewsForAssignment);
router.post('/rate', auth, rateReviewUsefulness);

module.exports = router;
