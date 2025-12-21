const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateUserDetails } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);
router.put('/updatedetails', authMiddleware, updateUserDetails);

module.exports = router;
