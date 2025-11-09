const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Validate JWT payload structure
const validatePayload = (payload) => {
  if (!payload) {
    throw new Error('Payload is required');
  }
  if (!payload.id) {
    throw new Error('Payload must contain an id');
  }
  if (!Array.isArray(payload.roles) || payload.roles.length === 0) {
    console.warn('No roles provided in JWT payload, defaulting to [\'user\']');
    payload.roles = ['user'];
  }
  return payload;
};

exports.signAccessToken = (payload) => {
  try {
    const validPayload = validatePayload(payload);
    return jwt.sign(validPayload, ACCESS_SECRET, { 
      expiresIn: ACCESS_EXPIRES_IN,
      algorithm: 'HS256'
    });
  } catch (error) {
    console.error('Error signing access token:', error);
    throw new Error('Failed to generate access token');
  }
};

exports.signRefreshToken = (payload) => {
  try {
    const validPayload = validatePayload(payload);
    return jwt.sign(validPayload, REFRESH_SECRET, { 
      expiresIn: REFRESH_EXPIRES_IN,
      algorithm: 'HS256'
    });
  } catch (error) {
    console.error('Error signing refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
};

exports.verifyAccessToken = (token) => {
  if (!token) {
    throw new Error('No token provided');
  }
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET, { algorithms: ['HS256'] });
    return validatePayload(decoded);
  } catch (error) {
    console.error('Access token verification failed:', error.message);
    throw new Error('Invalid or expired access token');
  }
};

exports.verifyRefreshToken = (token) => {
  if (!token) {
    throw new Error('No refresh token provided');
  }
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET, { algorithms: ['HS256'] });
    return validatePayload(decoded);
  } catch (error) {
    console.error('Refresh token verification failed:', error.message);
    throw new Error('Invalid or expired refresh token');
  }
};