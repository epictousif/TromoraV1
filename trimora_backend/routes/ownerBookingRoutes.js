const express = require('express');
const bookingController = require('../controllers/bookingController');
const verifyAccess = require('../middleware/auth');

const router = express.Router();

// Salon owner: list bookings for a salon
router.get('/bookings/:salonId', verifyAccess(['admin', 'saloonUser']), bookingController.listBySalon);

// Salon owner/admin: update booking status
router.put('/bookings/:id/status', verifyAccess(['admin', 'saloonUser']), bookingController.updateStatus);

module.exports = router;
