const express = require('express');
const freshaBookingController = require('../controllers/freshaBookingController');
const verifyAccess = require('../middleware/auth');

const router = express.Router();

// Get services for a salon (public - no auth needed for browsing)
router.get('/salon/:salonId/services', freshaBookingController.getSalonServices);

// Get professionals for a salon (public - no auth needed for browsing)
router.get('/salon/:salonId/professionals', freshaBookingController.getSalonProfessionals);

// Get available time slots for a specific date (public - no auth needed for browsing)
router.get('/salon/:salonId/slots', freshaBookingController.getAvailableSlots);

// Create booking (requires authentication)
router.post('/book', verifyAccess(['user', 'admin']), freshaBookingController.createFreshaBooking);

// Get booking confirmation details
router.get('/confirmation/:bookingId', verifyAccess(['user', 'admin']), freshaBookingController.getBookingConfirmation);

module.exports = router;
