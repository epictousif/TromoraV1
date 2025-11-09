const mongoose = require('mongoose');

const servicePackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployeeService',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }],
  packagePrice: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  totalDuration: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['Hair & Beard', 'Facial & Skincare', 'Body Care', 'Grooming Package', 'Premium Package'],
    default: 'Grooming Package'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date
  },
  maxBookingsPerDay: {
    type: Number,
    default: 10
  },
  availableEmployees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate savings amount
servicePackageSchema.virtual('savingsAmount').get(function() {
  return this.originalPrice - this.packagePrice;
});

// Calculate discount percentage if not set
servicePackageSchema.pre('save', function(next) {
  if (!this.discountPercentage && this.originalPrice > 0) {
    this.discountPercentage = Math.round(((this.originalPrice - this.packagePrice) / this.originalPrice) * 100);
  }
  next();
});

// Index for efficient queries
servicePackageSchema.index({ salon: 1, isActive: 1 });
servicePackageSchema.index({ category: 1, isActive: 1 });
servicePackageSchema.index({ validFrom: 1, validUntil: 1 });

module.exports = mongoose.model('ServicePackage', servicePackageSchema);
