const SaloonUser = require('../models/SaloonUser');
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');
const redisClient = require('../utils/redisClient');

const SALOON_USER_CACHE_PREFIX = 'saloonUser:';
const REFRESH_TOKEN_PREFIX = 'saloonUser:refresh:';

// Helper to cache user by id
async function cacheUser(user) {
  try {
    await redisClient.set(SALOON_USER_CACHE_PREFIX + user._id, JSON.stringify(user), { EX: 900 }); // 15 min
  } catch (e) {}
}

// Helper to get user from cache
async function getCachedUser(id) {
  try {
    const data = await redisClient.get(SALOON_USER_CACHE_PREFIX + id);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

// Register (only name, email, password are required)
exports.register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, aadharCard, panNumber } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Normalize
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Check for existing by email
    const existingByEmail = await SaloonUser.findOne({ email: normalizedEmail });
    if (existingByEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Optional: check others only if provided
    if (phoneNumber) {
      const existingPhone = await SaloonUser.findOne({ phoneNumber });
      if (existingPhone) return res.status(400).json({ message: 'Phone number already exists' });
    }
    if (aadharCard) {
      const existingAadhar = await SaloonUser.findOne({ aadharCard });
      if (existingAadhar) return res.status(400).json({ message: 'Aadhar card already exists' });
    }
    if (panNumber) {
      const existingPan = await SaloonUser.findOne({ panNumber });
      if (existingPan) return res.status(400).json({ message: 'PAN number already exists' });
    }

    const createPayload = { name, email: normalizedEmail, password };
    if (phoneNumber) createPayload.phoneNumber = phoneNumber;
    if (aadharCard) createPayload.aadharCard = aadharCard;
    if (panNumber) createPayload.panNumber = panNumber;

    const user = await SaloonUser.create(createPayload);
    await cacheUser(user);
    res.status(201).json({ status: 'success', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    console.error('Register error:', e);
    res.status(400).json({ message: e.message || 'Registration failed' });
  }
};

// Login
exports.login = async (req, res) => {
 
  
  const { email, password } = req.body;

  try {
    // 1. Normalize and find user (avoid case/whitespace issues)
    const normalizedEmail = (email || '').trim().toLowerCase();
    let user = await SaloonUser.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
     
      return res.status(401).json({ message: 'Invalid credentials' });
    }
   
    // 2. Verify password
 
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
    
      return res.status(401).json({ message: 'Invalid credentials' });
    }
   

    // 3. Create JWTs
   
    const payload = { id: user._id, role: user.role };
    const accessToken = jwt.signAccessToken(payload);
    const refreshToken = jwt.signRefreshToken(payload);
  
   

    // 4. Store refreshToken in Redis (or fallback to DB)
    try {
      await redisClient.set(REFRESH_TOKEN_PREFIX + user._id, refreshToken, {
        EX: 7 * 24 * 60 * 60, // 7 days
      });
      
    } catch (e) {
      
      user.refreshToken = refreshToken;
      await user.save();
    }

    // 5. Optional: cache user
    await cacheUser(user);

    // 6. Respond
    const responseData = {
      accessToken,
      refreshToken,
      userId: user._id,
      message: 'Login successful',
    };
    
   
    
    res.json(responseData);
  } catch (error) {
    console.error(' Backend: Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Refresh token
exports.refresh = async (req, res) => {
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
      const user = await SaloonUser.findById(payload.id).select('+refreshToken');
      if (!user || user.refreshToken !== refreshToken) {
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
  let user = await getCachedUser(req.user.id);
  if (!user) {
    user = await SaloonUser.findById(req.user.id);
    if (user) await cacheUser(user);
  }
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, aadharCard: user.aadharCard, panNumber: user.panNumber, role: user.role });
};

// Logout
exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
    // Remove user cache and refresh token from Redis
    try {
      await redisClient.del(SALOON_USER_CACHE_PREFIX + userId);
      await redisClient.del(REFRESH_TOKEN_PREFIX + userId);
    } catch (e) {}
    // Set refreshToken to null in DB
    await SaloonUser.findByIdAndUpdate(userId, { refreshToken: null });
    res.json({ message: 'Logout successful' });
  } catch (e) {
    res.status(500).json({ message: 'Logout failed', error: e.message });
  }
};

// Get all saloon users
exports.getAll = async (req, res) => {
  try {
    const users = await SaloonUser.find();
    res.json({ status: 'success', users });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch users', error: e.message });
  }
};

// Get saloon user by ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  let user = await getCachedUser(id);
  if (!user) {
    user = await SaloonUser.findById(id);
    if (user) await cacheUser(user);
  }
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ status: 'success', user });
};

// Update saloon user
exports.update = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  // Prevent updating sensitive fields
  delete updateData.password;
  delete updateData.refreshToken;
  try {
    const user = await SaloonUser.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Invalidate and update cache
    try { await redisClient.del(SALOON_USER_CACHE_PREFIX + id); } catch (e) {}
    await cacheUser(user);
    res.json({ status: 'success', user });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update user', error: e.message });
  }
};

// Delete saloon user
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await SaloonUser.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Invalidate cache
    try { await redisClient.del(SALOON_USER_CACHE_PREFIX + id); } catch (e) {}
    res.json({ status: 'success', message: 'User deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete user', error: e.message });
  }
}; 