const Booking = require('../models/Booking');
const verifyAccess = require('../middleware/auth');
const User = require('../models/User');
const { FIRST_BOOKING_DISCOUNT_PERCENT } = require('../utils/referrals');

// Create a booking
exports.create = async (req, res) => {
  try {
    const { salonId, services = [], appointmentTime, notes } = req.body;
    if (!salonId || !appointmentTime || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: 'salonId, appointmentTime and services[] are required' });
    }

    let totalPrice = services.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

    // Apply first-booking discount if user was referred and hasn't used it
    let discountApplied = false;
    try {
      const user = await User.findById(req.user.id);
      if (user && user.referredBy && !user.firstBookingDiscountUsed) {
        const discount = Math.round((totalPrice * FIRST_BOOKING_DISCOUNT_PERCENT) / 100);
        totalPrice = Math.max(0, totalPrice - discount);
        user.firstBookingDiscountUsed = true;
        await user.save();
        discountApplied = true;
      }
    } catch (e) {}

    const booking = await Booking.create({
      customerId: req.user.id,
      salonId,
      services: services.map(s => ({
        serviceId: s.serviceId || undefined,
        name: s.name,
        price: s.price,
        durationMinutes: s.durationMinutes || 0,
      })),
      totalPrice,
      appointmentTime: new Date(appointmentTime),
      status: 'pending',
      notes: notes || '',
    });

    return res.status(201).json({
      status: 'success',
      booking,
      confirmation: {
        bookingId: booking.bookingId,
        totalPrice: booking.totalPrice,
        appointmentTime: booking.appointmentTime,
        discountApplied,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to create booking', error: e.message });
  }
};

// Get bookings for current customer (or by query customerId for admin/self)
exports.listByCustomer = async (req, res) => {
  try {
    const customerId = req.query.customerId || req.user.id;
    if (req.user.role !== 'admin' && String(customerId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const bookings = await Booking.find({ customerId })
      .sort({ createdAt: -1 })
      .populate('salonId', 'name');
    return res.json({ status: 'success', bookings });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch bookings', error: e.message });
  }
};

// Get bookings for a salon (owner)
exports.listBySalon = async (req, res) => {
  try {
    const { salonId } = req.params;
    // If you have an owner->salon mapping, validate ownership here
    const bookings = await Booking.find({ salonId }).sort({ createdAt: -1 });
    return res.json({ status: 'success', bookings });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch salon bookings', error: e.message });
  }
};

// Update booking status (owner/admin)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    return res.json({ status: 'success', booking });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to update booking', error: e.message });
  }
};

// Get booking details with complete information for WhatsApp confirmation
exports.getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('customerId', 'name phoneNumber email')
      .populate('salonId', 'name phoneNumber address');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (req.user.role !== 'admin' && String(booking.customerId._id) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Format the response for WhatsApp confirmation
    const bookingDetails = {
      id: booking.bookingId,
      userName: booking.customerId.name,
      userPhone: booking.customerId.phoneNumber,
      serviceName: booking.services.map(s => s.name).join(', '),
      salonName: booking.salonId.name,
      salonPhone: booking.salonId.phoneNumber,
      date: booking.appointmentTime.toISOString().split('T')[0],
      time: booking.appointmentTime.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      duration: booking.services.reduce((total, s) => total + s.durationMinutes, 0),
      price: booking.totalPrice,
      status: booking.status,
      notes: booking.notes,
      salonAddress: booking.salonId.address
    };

    return res.json({ 
      status: 'success', 
      booking: bookingDetails 
    });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch booking details', error: e.message });
  }
};
