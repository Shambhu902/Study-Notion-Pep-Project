const jwt = require('jsonwebtoken');


const User = require('../models/User');

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user to get latest role/status
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    if (user.status === 'banned') {
        return res.status(403).json({ message: 'User is banned' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
