const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getInMemoryStatus, memoryDb } = require('../config/db');

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if token is missing
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'AURA_FITNESS_JWT_SECRET_KEY');
    
    const isInMemory = getInMemoryStatus();
    let user = null;

    if (isInMemory || decoded.id.startsWith('mem_')) {
      // Find in-memory
      user = memoryDb.users.find(u => u._id === decoded.id);
    } else {
      // Find in MongoDB
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({ error: 'User session expired or account not found.' });
    }

    // Bind user profile to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('🔓 JWT Verification Error:', error.message);
    return res.status(401).json({ error: 'Session invalid or token expired. Please log in again.' });
  }
};
