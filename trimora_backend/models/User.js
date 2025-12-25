const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
      index: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: false,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[0-9]{10,15}$/.test(v);
        },
        message: 'Please provide a valid 10-15 digit phone number'
      }
    },
    dob: {
      type: Date,
      required: false,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    profilePicture: {
      type: String,
      default: ''
    },
    authMethod: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
    refreshToken: {
      type: String,
      select: false,
    },
    roles: {
      type: [{
        type: String,
        enum: ["user", "salonOwner"],
      }],
      default: ["user"],
      index: true,
    },
    passwordChangedAt: Date,
    passwordResetOTP: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Referral system
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    referralCount: {
      type: Number,
      default: 0,
    },
    firstBookingDiscountUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
userSchema.index({ email: 1, role: 1 })

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password, 12)

  // Set passwordChangedAt for existing users
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000
  }

  next()
})

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add a role to user
userSchema.methods.addRole = function (role) {
  if (!this.roles.includes(role)) {
    this.roles.push(role);
  }
  return this.save();
};

// Method to check if user has a specific role
userSchema.methods.hasRole = function (role) {
  return this.roles.includes(role);
};

// Check if password changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Number.parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestamp < changedTimestamp
  }
  return false
}

// Generate password reset OTP
userSchema.methods.createPasswordResetOTP = function () {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP to database (no hashing needed for OTP)
  this.passwordResetOTP = otp;

  // Set expiry time (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Return OTP to send via email
  return otp;
};

const User = mongoose.model("User", userSchema)
module.exports = User
