const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Google OAuth routes
router.post('/google', authController.googleAuth);
router.post('/refresh-token', authController.refreshAccessToken);

module.exports = router;
