const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');
const redisClient = require('../utils/redisClient');
const { generateUniqueReferralCode, awardReferrer } = require('../utils/referrals');

const USER_CACHE_PREFIX = 'user:';
const REFRESH_TOKEN_PREFIX = 'user:refresh:';

async function cacheUser(user) {
  try {
    await redisClient.set(USER_CACHE_PREFIX + user._id, JSON.stringify(user), { EX: 900 });
  } catch (e) {}
}

async function getCachedUser(id) {
  try {
    const data = await redisClient.get(USER_CACHE_PREFIX + id);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

// Register user with role support
exports.register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, dob, referralCode, role = 'user' } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = (email || '').trim().toLowerCase();

    // Check if user exists and add role if needed
    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      // If user exists, add the new role if not already present
      if (!user.roles.includes(role)) {
        user.roles.push(role);
        await user.save();
        await cacheUser(user);
        return res.status(200).json({
          status: 'success',
          message: 'Role added to existing account',
          user: { 
            id: user._id, 
            name: user.name, 
            email: user.email, 
            phoneNumber: user.phoneNumber, 
            roles: user.roles,
            referralCode: user.referralCode 
          },
        });
      }
      return res.status(400).json({ message: 'User already has this role' });
    }

    // Optional DOB handling
    let dobDate = undefined;
    if (dob) {
      const d = new Date(dob);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ message: 'Invalid date of birth' });
      }
      const now = new Date();
      if (d > now) {
        return res.status(400).json({ message: 'Date of birth cannot be in the future' });
      }
      dobDate = d;
    }

    // If referral code provided, validate referrer exists
    let referrer = null;
    if (referralCode) {
      const code = String(referralCode).trim().toUpperCase();
      referrer = await User.findOne({ referralCode: code });
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
    }

    // Create new user with initial role
    user = await User.create({
      name,
      email: normalizedEmail,
      password,
      phoneNumber: phoneNumber || null,
      dob: dobDate,
      referredBy: referrer ? referrer._id : null,
      roles: [role]
    });

    // Generate unique referral code for the new user
    try {
      user.referralCode = await generateUniqueReferralCode(User, `${user._id}:${user.email}`);
      await user.save();
    } catch (e) {}

    // Award referrer if any
    if (referrer) {
      try { await awardReferrer(referrer); } catch (e) {}
    }
    await cacheUser(user);
    return res.status(201).json({
      status: 'success',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phoneNumber: user.phoneNumber, 
        dob: user.dob, 
        roles: user.roles, 
        referralCode: user.referralCode, 
        referredBy: user.referredBy 
      },
    });
  } catch (e) {
    return res.status(400).json({ message: e.message || 'Registration failed' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = (email || '').trim().toLowerCase();
    console.log(`Login attempt for email: ${normalizedEmail}`);
    
    // Find user with password
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      console.log(`User not found: ${normalizedEmail}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const valid = await user.comparePassword(password);
    if (!valid) {
      console.log(`Invalid password for user: ${user._id}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const payload = { 
      id: user._id.toString(), // Ensure ID is a string
      roles: Array.isArray(user.roles) ? user.roles : ['user'] // Ensure roles is an array
    };
    
    console.log('Generating tokens for user:', {
      userId: payload.id,
      roles: payload.roles
    });

    const accessToken = jwt.signAccessToken(payload);
    const refreshToken = jwt.signRefreshToken(payload);

    if (!accessToken || !refreshToken) {
      throw new Error('Failed to generate authentication tokens');
    }

    // Store refresh token in Redis or fallback to database
    try {
      const redisKey = `${REFRESH_TOKEN_PREFIX}${user._id}`;
      await redisClient.set(redisKey, refreshToken, { 
        EX: 7 * 24 * 60 * 60 // 7 days
      });
      console.log(`Stored refresh token in Redis for user: ${user._id}`);
    } catch (redisError) {
      console.error('Redis error, falling back to database:', redisError.message);
      user.refreshToken = refreshToken;
      await user.save();
      console.log(`Stored refresh token in database for user: ${user._id}`);
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roles: user.roles,
      profilePicture: user.profilePicture,
      referralCode: user.referralCode
    };

    await cacheUser(user);
    return res.json({ 
      status: 'success',
      accessToken, 
      refreshToken, 
      user: userData 
    });
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Refresh
exports.refresh = async (req, res) => {
  let refreshToken = req.body.refreshToken
    || req.cookies?.refreshToken
    || req.query?.refreshToken
    || req.headers['x-refresh-token']
    || req.headers['authorization']?.replace('Bearer ', '')
    || req.params?.refreshToken;

  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
  try {
    const payload = jwt.verifyRefreshToken(refreshToken);
    let stored = null;
    try { stored = await redisClient.get(REFRESH_TOKEN_PREFIX + payload.id); } catch {}
    if (!stored) {
      const user = await User.findById(payload.id).select('+refreshToken');
      if (!user || user.refreshToken !== refreshToken) return res.status(401).json({ message: 'Invalid refresh token' });
    } else if (stored !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const accessToken = jwt.signAccessToken({ id: payload.id, role: payload.role });
    return res.json({ accessToken });
  } catch (e) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Check if email exists
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    return res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({ message: 'Error checking email' });
  }
};

// Add role to existing user
exports.addRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.roles.includes(role)) {
      return res.status(400).json({ message: 'User already has this role' });
    }

    user.roles.push(role);
    await user.save();
    await cacheUser(user);

    res.status(200).json({
      status: 'success',
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding role', error: error.message });
  }
};

// Me
exports.me = async (req, res) => {
  let user = await getCachedUser(req.user.id);
  if (!user) {
    user = await User.findById(req.user.id);
    if (user) await cacheUser(user);
  }
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    phoneNumber: user.phoneNumber, 
    dob: user.dob, 
    role: user.role,
    referralCode: user.referralCode,
    rewardPoints: user.rewardPoints || 0,
    referralCount: user.referralCount || 0
  });
};

// Logout
exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
    try {
      await redisClient.del(USER_CACHE_PREFIX + userId);
      await redisClient.del(REFRESH_TOKEN_PREFIX + userId);
    } catch (e) {}
    await User.findByIdAndUpdate(userId, { refreshToken: null });
    return res.json({ message: 'Logout successful' });
  } catch (e) {
    return res.status(500).json({ message: 'Logout failed', error: e.message });
  }
};

// Admin-only: list all users
exports.getAll = async (req, res) => {
  try {
    const users = await User.find();
    return res.json({ status: 'success', users });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch users', error: e.message });
  }
};

// Admin or owner: get by id
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role !== 'admin' && String(req.user.id) !== String(id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    let user = await getCachedUser(id);
    if (!user) {
      user = await User.findById(id);
      if (user) await cacheUser(user);
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ status: 'success', user });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch user', error: e.message });
  }
};

// Admin or owner: update
exports.update = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  delete updateData.password;
  delete updateData.refreshToken;
  try {
    if (req.user.role !== 'admin' && String(req.user.id) !== String(id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    try { await redisClient.del(USER_CACHE_PREFIX + id); } catch {}
    await cacheUser(user);
    return res.json({ status: 'success', user });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to update user', error: e.message });
  }
};

// Admin-only: delete
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    try { await redisClient.del(USER_CACHE_PREFIX + id); } catch {}
    return res.json({ status: 'success', message: 'User deleted' });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to delete user', error: e.message });
  }
};

// Get referral information
exports.getReferralInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Get users referred by this user
    const referredUsers = await User.find({ referredBy: user._id })
      .select('name email createdAt')
      .sort({ createdAt: -1 });
    
    return res.json({
      status: 'success',
      referralInfo: {
        referralCode: user.referralCode,
        rewardPoints: user.rewardPoints || 0,
        referralCount: user.referralCount || 0,
        referredUsers: referredUsers.map(u => ({
          name: u.name,
          email: u.email,
          joinedAt: u.createdAt
        }))
      }
    });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch referral info', error: e.message });
  }
};
