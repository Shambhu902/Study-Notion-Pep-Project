const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { 
    createAssignment, 
    getMyAssignments, 
    getAssignmentsToReview, 
    getAssignmentById,
    downloadAssignment
} = require('../controllers/assignmentController');

router.post('/create', auth, upload.single('file'), createAssignment);
router.get('/my', auth, getMyAssignments);
router.get('/to-review', auth, getAssignmentsToReview);
router.get('/download/:id', auth, downloadAssignment);
router.get('/:id', auth, getAssignmentById);

module.exports = router;
