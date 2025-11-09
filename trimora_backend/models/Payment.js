const mongoose = require('mongoose');

function generatePaymentId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PAY-${ts}-${rnd}`;
}

const PaymentSchema = new mongoose.Schema(
  {
    paymentId: { 
      type: String, 
      unique: true, 
      index: true, 
      default: generatePaymentId 
    },
    
    // Core References
    bookingId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Booking', 
      required: true, 
      index: true 
    },
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      index: true 
    },
    salonId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Salon', 
      required: true, 
      index: true 
    },
    
    // Service and Employee References
    services: [{
      serviceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'EmployeeService' 
      },
      employeeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employee' 
      },
      name: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
      durationMinutes: { type: Number, default: 0 }
    }],
    
    // Payment Details
    amount: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    currency: { 
      type: String, 
      default: 'INR' 
    },
    
    // Payment Method
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cash', 'card', 'upi', 'wallet', 'pay_on_visit'],
      default: 'pay_on_visit'
    },
    
    // Payment Status
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
      index: true
    },
    
    // Razorpay Integration
    razorpayOrderId: { 
      type: String, 
      sparse: true, 
      index: true 
    },
    razorpayPaymentId: { 
      type: String, 
      sparse: true, 
      index: true 
    },
    razorpaySignature: { 
      type: String 
    },
    
    // Transaction Details
    transactionId: { 
      type: String, 
      sparse: true, 
      index: true 
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    // Discount and Offers
    discountAmount: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed', 'referral', 'coupon'],
      default: null
    },
    couponCode: { 
      type: String, 
      default: null 
    },
    
    // Refund Details
    refundAmount: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    refundReason: { 
      type: String 
    },
    refundedAt: { 
      type: Date 
    },
    
    // Timestamps
    paidAt: { 
      type: Date 
    },
    failedAt: { 
      type: Date 
    },
    
    // Additional Info
    notes: { 
      type: String, 
      default: '' 
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better performance
PaymentSchema.index({ bookingId: 1, status: 1 });
PaymentSchema.index({ customerId: 1, createdAt: -1 });
PaymentSchema.index({ salonId: 1, status: 1, createdAt: -1 });
PaymentSchema.index({ razorpayOrderId: 1 });
PaymentSchema.index({ razorpayPaymentId: 1 });

// Virtual for net amount after discount
PaymentSchema.virtual('netAmount').get(function() {
  return this.amount - this.discountAmount;
});

// Virtual for payment status display
PaymentSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending',
    'processing': 'Processing',
    'completed': 'Completed',
    'failed': 'Failed',
    'cancelled': 'Cancelled',
    'refunded': 'Refunded'
  };
  return statusMap[this.status] || this.status;
});

// Pre-save middleware to update timestamps
PaymentSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.paidAt) {
      this.paidAt = new Date();
    } else if (this.status === 'failed' && !this.failedAt) {
      this.failedAt = new Date();
    } else if (this.status === 'refunded' && !this.refundedAt) {
      this.refundedAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);
