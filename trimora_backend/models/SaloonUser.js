const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saloonuserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  phoneNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    match: [/^[0-9]{10}$/, 'Phone number must be 10 digits'],
    index: true
  },
  aadharCard: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    match: [/^[0-9]{12}$/, 'Aadhar must be 12 digits'],
    index: true
  },
  panNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN format is invalid'],
    index: true
  },
  role: {
    type: String,
    enum: ['saloonUser'],
    default: 'saloonUser',
    index: true
  },
  refreshToken: {
    type: String,
    select: false
  },
  passwordChangedAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
saloonuserSchema.index({ email: 1, role: 1 });


// Hash password before saving
saloonuserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  
  // Set passwordChangedAt for existing users
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  
  next();
});

// Method to compare passwords
saloonuserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password changed after JWT was issued
saloonuserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

module.exports = mongoose.model('SaloonUser', saloonuserSchema);
