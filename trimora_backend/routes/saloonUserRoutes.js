const express = require('express');
const saloonUserController = require('../controllers/saloonUserController');
const verifyAccess = require('../middleware/auth');

const router = express.Router();

router.post('/register', saloonUserController.register);
router.post('/login', saloonUserController.login);
router.post('/refresh', saloonUserController.refresh);
router.get('/me', verifyAccess(['admin', 'saloonUser']), saloonUserController.me);
router.post('/logout', verifyAccess(['admin', 'saloonUser']), saloonUserController.logout);
router.get('/', verifyAccess(['admin', 'saloonUser']), saloonUserController.getAll);
router.get('/:id', verifyAccess(['admin', 'saloonUser']), saloonUserController.getById);
router.put('/:id', verifyAccess(['admin', 'saloonUser']), saloonUserController.update);
router.delete('/:id', verifyAccess(['admin', 'saloonUser']), saloonUserController.delete);

module.exports = router; 