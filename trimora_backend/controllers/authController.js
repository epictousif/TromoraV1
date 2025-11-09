const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Google OAuth Login/Signup
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Google token is required',
      });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture,
        authMethod: 'google',
        isEmailVerified: true,
      });
    } else if (user.authMethod !== 'google') {
      // If user exists but signed up with email/password
      return res.status(400).json({
        status: 'error',
        message: 'An account already exists with this email. Please log in with your password.',
      });
    }

    // Generate JWT token
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Remove sensitive data from output
    user.password = undefined;
    user.__v = undefined;

    res.status(200).json({
      status: 'success',
      token: accessToken,
      refreshToken,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during authentication',
    });
  }
};

// Helper function to generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

// Generate new access token using refresh token
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'No refresh token provided',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token',
      });
    }

    // Generate new access token
    const accessToken = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      token: accessToken,
    });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired refresh token',
    });
  }
};

module.exports = {
  googleAuth,
  refreshAccessToken,
};
