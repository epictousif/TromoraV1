const mongoose = require('mongoose');

function generateBookingId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TR-${ts}-${rnd}`;
}

const ServiceItemSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeService' },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    durationMinutes: { type: Number, default: 0 },
  },
  { _id: false }
);

const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true, index: true, default: generateBookingId },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    services: { type: [ServiceItemSchema], default: [] },
    totalPrice: { type: Number, required: true, min: 0 },
    appointmentTime: { type: Date, required: true, index: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending', index: true },
    notes: { type: String, default: '' },
    
    // Payment Reference
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', index: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Booking', BookingSchema);
