const express = require('express');
const saloonController = require('../controllers/saloonController');
const verifyAccess = require('../middleware/auth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/saloon', verifyAccess(['admin', 'saloonUser']), upload.array('images'), saloonController.create);
router.get('/getAllSalons', saloonController.getAll);
router.get('/getSalon/:id',  saloonController.getById);
router.get('/getAllById/:id', verifyAccess(['admin', 'saloonUser']), saloonController.getAllById);

// New routes for getting salons by user ID
router.get('/user/:userId', verifyAccess(['admin', 'saloonUser']), saloonController.getSalonsByUserId);
router.get('/user/:userId/details', verifyAccess(['admin', 'saloonUser']), saloonController.getSalonsByUserIdWithDetails);
router.get('/user/:userId/count', verifyAccess(['admin', 'saloonUser']), saloonController.getSalonCountByUserId);

router.put('/updateSalon/:id', verifyAccess(['admin', 'saloonUser']), upload.array('images'), saloonController.update);
router.delete('/deleteSalon/:id', verifyAccess(['admin', 'saloonUser']), saloonController.delete);

// Search routes
router.get('/search/location',  saloonController.searchByLocation);
router.get('/search/nearby', saloonController.searchNearby);
router.get('/search/services', saloonController.searchByServices);

module.exports = router; 