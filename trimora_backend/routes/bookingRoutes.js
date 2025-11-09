const express = require('express');
const bookingController = require('../controllers/bookingController');
const verifyAccess = require('../middleware/auth');

const router = express.Router();

// Customer creates a booking
router.post('/', verifyAccess(['user', 'admin']), bookingController.create);

// Customer lists own bookings (or admin by query)
router.get('/', verifyAccess(['user', 'admin']), bookingController.listByCustomer);

// Get booking details for WhatsApp confirmation
router.get('/:id/details', verifyAccess(['user', 'admin']), bookingController.getBookingDetails);

// Update booking status (salon owner/admin)
router.put('/:id/status', verifyAccess(['admin']), bookingController.updateStatus);

// Get bookings by salon (salon owner)
router.get('/salon/:salonId', verifyAccess(['admin']), bookingController.listBySalon);

module.exports = router;
