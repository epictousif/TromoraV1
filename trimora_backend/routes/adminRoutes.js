const express = require('express');
const adminController = require('../controllers/adminController');
const verifyAccess = require('../middleware/auth');

const router = express.Router();

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.post('/refresh', adminController.refresh);
router.get('/me', verifyAccess(['admin']), adminController.me);
router.post('/logout', verifyAccess(['admin']), adminController.logout);

// Add CRUD routes here if needed, all protected by verifyAccess(['admin'])

module.exports = router; 