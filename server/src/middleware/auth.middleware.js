const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// Sample user data that matches the database structure (roughly)
const SAMPLE_USER = {
  id: 'sample-user-id',
  email: 'sample@nutrisense.com',
  name: 'Sample User',
  isOnboarded: true,
};

const authenticate = async (req, res, next) => {
  // Always set req.user to sample user and continue
  req.user = SAMPLE_USER;
  next();
};

const optionalAuth = async (req, res, next) => {
  req.user = SAMPLE_USER;
  next();
};

module.exports = { authenticate, optionalAuth };

