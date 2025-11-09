const express = require('express');
const paymentController = require('../controllers/paymentController');
const verifyAccess = require('../middleware/auth');

const router = express.Router();

// Create payment/order
router.post('/create', verifyAccess(['user', 'admin']), paymentController.createPayment);

// Verify Razorpay payment
router.post('/verify', verifyAccess(['user', 'admin']), paymentController.verifyPayment);

// Get payment details
router.get('/:id', verifyAccess(['user', 'admin']), paymentController.getPayment);

// Get user's payment history
router.get('/', verifyAccess(['user', 'admin']), paymentController.getPaymentHistory);

// Get salon payments (admin/salon owner)
router.get('/salon/:salonId', verifyAccess(['admin']), paymentController.getSalonPayments);

// Process refund (admin only)
router.post('/:id/refund', verifyAccess(['admin']), paymentController.processRefund);

module.exports = router;
