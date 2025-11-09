const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');
const redisClient = require('../utils/redisClient');

const ADMIN_CACHE_PREFIX = 'admin:';
const REFRESH_TOKEN_PREFIX = 'admin:refresh:';

// Helper to cache admin by id
async function cacheAdmin(admin) {
  try {
    await redisClient.set(ADMIN_CACHE_PREFIX + admin._id, JSON.stringify(admin), { EX: 900 }); // 15 min
  } catch (e) {
    // fallback: do nothing
  }
}

// Helper to get admin from cache
async function getCachedAdmin(id) {
  try {
    const data = await redisClient.get(ADMIN_CACHE_PREFIX + id);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

// Register
exports.register = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  // Check for existing email or phone number
  const existing = await Admin.findOne({ $or: [{ email }, { phoneNumber }] });
  if (existing) {
    if (existing.email === email) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (existing.phoneNumber === phoneNumber) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }
  }
  const admin = await Admin.create({ name, email, phoneNumber, password });
  await cacheAdmin(admin);
  res.status(201).json({ status: 'success', admin: { id: admin._id, name, email, phoneNumber, role: admin.role } });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  let admin = await Admin.findOne({ email }).select('+password');
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const accessToken = jwt.signAccessToken({ id: admin._id, role: admin.role });
  const refreshToken = jwt.signRefreshToken({ id: admin._id, role: admin.role });
  // Try to store refreshToken in Redis, fallback to DB
  let redisOk = false;
  try {
    await redisClient.set(REFRESH_TOKEN_PREFIX + admin._id, refreshToken, { EX: 7 * 24 * 60 * 60 });
    redisOk = true;
  } catch (e) {
    redisOk = false;
  }
  if (!redisOk) {
    admin.refreshToken = refreshToken;
    await admin.save();
  }
  await cacheAdmin(admin);
  res.json({ accessToken, refreshToken });
};

// Refresh token
exports.refresh = async (req, res) => {
  // Try to get refreshToken from body, cookies, query, headers, or params
  let refreshToken = req.body.refreshToken
    || req.cookies?.refreshToken
    || req.query?.refreshToken
    || req.headers['x-refresh-token']
    || req.headers['authorization']?.replace('Bearer ', '')
    || req.params?.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required' });
  }
  try {
    const payload = jwt.verifyRefreshToken(refreshToken);
    // Try Redis first
    let stored = null;
    try {
      stored = await redisClient.get(REFRESH_TOKEN_PREFIX + payload.id);
    } catch (e) {
      stored = null;
    }
    if (!stored) {
      // fallback to DB
      const admin = await Admin.findById(payload.id).select('+refreshToken');
      if (!admin || admin.refreshToken !== refreshToken) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
    } else if (stored !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const accessToken = jwt.signAccessToken({ id: payload.id, role: payload.role });
    res.json({ accessToken });
  } catch (e) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Protected profile
exports.me = async (req, res) => {
  let admin = await getCachedAdmin(req.user.id);
  if (!admin) {
    admin = await Admin.findById(req.user.id);
    if (admin) await cacheAdmin(admin);
  }
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.json({ id: admin._id, name: admin.name, email: admin.email, phoneNumber: admin.phoneNumber, role: admin.role });
};

// Logout
exports.logout = async (req, res) => {
  try {
    const adminId = req.user.id;
    // Remove admin cache and refresh token from Redis
    try {
      await redisClient.del(ADMIN_CACHE_PREFIX + adminId);
      await redisClient.del(REFRESH_TOKEN_PREFIX + adminId);
    } catch (e) {
      // fallback: do nothing
    }
    // Set refreshToken to null in DB
    await Admin.findByIdAndUpdate(adminId, { refreshToken: null });
    res.json({ message: 'Logout successful' });
  } catch (e) {
    res.status(500).json({ message: 'Logout failed', error: e.message });
  }
}; 