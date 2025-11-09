const express = require('express');
const userController = require('../controllers/userController');
const verifyAccess = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/check-email', userController.checkEmail);

// Auth
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh', userController.refresh);
router.get('/me', verifyAccess(['user', 'admin']), userController.me);
router.post('/logout', verifyAccess(['user', 'admin']), userController.logout);

// Role Management
router.post('/:id/roles', verifyAccess(['admin']), userController.addRole);

// CRUD
router.get('/', verifyAccess(['admin']), userController.getAll);
router.get('/referral-info', verifyAccess(['user', 'admin']), userController.getReferralInfo);
router.get('/:id', verifyAccess(['admin', 'user']), userController.getById);
router.put('/:id', verifyAccess(['admin', 'user']), userController.update);
router.delete('/:id', verifyAccess(['admin']), userController.delete);

module.exports = router;
