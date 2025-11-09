const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order and payment record
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod = 'razorpay' } = req.body;

    // Get booking details with populated references
    const booking = await Booking.findById(bookingId)
      .populate('customerId', 'name email phoneNumber')
      .populate('salonId', 'name phoneNumber address');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user owns this booking
    if (String(booking.customerId._id) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized access to booking' });
    }

    // Check if payment already exists for this booking
    const existingPayment = await Payment.findOne({ 
      bookingId, 
      status: { $in: ['pending', 'processing', 'completed'] } 
    });

    if (existingPayment) {
      return res.status(400).json({ 
        message: 'Payment already exists for this booking',
        payment: existingPayment 
      });
    }

    let razorpayOrder = null;
    let paymentData = {
      bookingId,
      customerId: booking.customerId._id,
      salonId: booking.salonId._id,
      services: booking.services,
      amount: booking.totalPrice,
      paymentMethod,
      status: paymentMethod === 'pay_on_visit' ? 'pending' : 'pending'
    };

    // Create Razorpay order if online payment
    if (paymentMethod === 'razorpay') {
      const orderOptions = {
        amount: booking.totalPrice * 100, // Amount in paise
        currency: 'INR',
        receipt: `booking_${booking.bookingId}`,
        notes: {
          bookingId: booking.bookingId,
          customerId: booking.customerId._id.toString(),
          salonId: booking.salonId._id.toString(),
          customerName: booking.customerId.name,
          salonName: booking.salonId.name
        }
      };

      razorpayOrder = await razorpay.orders.create(orderOptions);
      paymentData.razorpayOrderId = razorpayOrder.id;
      paymentData.status = 'processing';
    }

    // Create payment record
    const payment = await Payment.create(paymentData);

    return res.status(201).json({
      status: 'success',
      payment: {
        id: payment._id,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        razorpayOrderId: payment.razorpayOrderId
      },
      razorpayOrder,
      booking: {
        id: booking._id,
        bookingId: booking.bookingId,
        customerName: booking.customerId.name,
        salonName: booking.salonId.name
      }
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return res.status(500).json({ 
      message: 'Failed to create payment', 
      error: error.message 
    });
  }
};

// Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      paymentId 
    } = req.body;

    // Find payment record
    const payment = await Payment.findOne({
      $or: [
        { _id: paymentId },
        { razorpayOrderId: razorpay_order_id }
      ]
    }).populate('bookingId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    // Verify user owns this payment
    if (String(payment.customerId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized access to payment' });
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      // Update payment as failed
      payment.status = 'failed';
      payment.failedAt = new Date();
      payment.gatewayResponse = { 
        error: 'Invalid signature',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      };
      await payment.save();

      return res.status(400).json({ 
        message: 'Payment verification failed',
        status: 'failed'
      });
    }

    // Payment successful - update records
    payment.status = 'completed';
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.paidAt = new Date();
    payment.transactionId = razorpay_payment_id;
    payment.gatewayResponse = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      verified: true
    };

    await payment.save();

    // Update booking status
    if (payment.bookingId) {
      payment.bookingId.status = 'confirmed';
      await payment.bookingId.save();
    }

    return res.json({
      status: 'success',
      message: 'Payment verified successfully',
      payment: {
        id: payment._id,
        paymentId: payment.paymentId,
        status: payment.status,
        amount: payment.amount,
        paidAt: payment.paidAt,
        transactionId: payment.transactionId
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ 
      message: 'Payment verification failed', 
      error: error.message 
    });
  }
};

// Get payment details
exports.getPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate('bookingId', 'bookingId appointmentTime status notes')
      .populate('customerId', 'name email phoneNumber')
      .populate('salonId', 'name phoneNumber address')
      .populate('services.serviceId', 'name description')
      .populate('services.employeeId', 'name specialization');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && String(payment.customerId._id) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    return res.json({
      status: 'success',
      payment
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to fetch payment details', 
      error: error.message 
    });
  }
};

// Get user's payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const customerId = req.user.role === 'admin' ? req.query.customerId : req.user.id;

    const filter = { customerId };
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate('bookingId', 'bookingId appointmentTime status')
      .populate('salonId', 'name address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(filter);

    return res.json({
      status: 'success',
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to fetch payment history', 
      error: error.message 
    });
  }
};

// Get salon's payment records (for salon owners/admin)
exports.getSalonPayments = async (req, res) => {
  try {
    const { salonId } = req.params;
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    const filter = { salonId };
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(filter)
      .populate('bookingId', 'bookingId appointmentTime status')
      .populate('customerId', 'name email phoneNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(filter);

    // Calculate summary statistics
    const stats = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    return res.json({
      status: 'success',
      payments,
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to fetch salon payments', 
      error: error.message 
    });
  }
};

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundAmount, refundReason } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Only completed payments can be refunded' });
    }

    if (refundAmount > payment.amount) {
      return res.status(400).json({ message: 'Refund amount cannot exceed payment amount' });
    }

    // Process refund with Razorpay if it was a Razorpay payment
    let refundResponse = null;
    if (payment.razorpayPaymentId) {
      try {
        refundResponse = await razorpay.payments.refund(payment.razorpayPaymentId, {
          amount: refundAmount * 100, // Amount in paise
          notes: {
            reason: refundReason,
            paymentId: payment.paymentId
          }
        });
      } catch (razorpayError) {
        return res.status(500).json({ 
          message: 'Refund failed at gateway', 
          error: razorpayError.message 
        });
      }
    }

    // Update payment record
    payment.status = 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundReason = refundReason;
    payment.refundedAt = new Date();
    payment.gatewayResponse = {
      ...payment.gatewayResponse,
      refund: refundResponse
    };

    await payment.save();

    return res.json({
      status: 'success',
      message: 'Refund processed successfully',
      payment: {
        id: payment._id,
        paymentId: payment.paymentId,
        status: payment.status,
        refundAmount: payment.refundAmount,
        refundedAt: payment.refundedAt
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Refund processing failed', 
      error: error.message 
    });
  }
};
