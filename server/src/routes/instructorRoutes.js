const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getAllAssignments, closeAssignment, exportReviews } = require('../controllers/instructorController');

// All routes protected by Auth + Instructor Role
router.get('/assignments', auth, role(['instructor']), getAllAssignments);
router.post('/close-assignment', auth, role(['instructor']), closeAssignment);
router.get('/export/:id', auth, role(['instructor']), exportReviews);

module.exports = router;
