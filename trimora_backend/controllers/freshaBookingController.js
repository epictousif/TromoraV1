const Booking = require('../models/Booking');
const EmployeeService = require('../models/EmployeeService');
const Employee = require('../models/Employee');
const Salon = require('../models/Saloon');
const User = require('../models/User');
const { FIRST_BOOKING_DISCOUNT_PERCENT } = require('../utils/referrals');

// Get services for a salon with pricing and duration
exports.getSalonServices = async (req, res) => {
  try {
    const { salonId } = req.params;
    
    const services = await EmployeeService.find({ 
      salon: salonId, 
      isActive: true 
    })
    .populate('employee', 'name profileImage rating')
    .sort({ category: 1, name: 1 });

    // Group services by category for better UI
    const groupedServices = services.reduce((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push({
        id: service._id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description,
        category: service.category,
        employee: service.employee
      });
      return acc;
    }, {});

    return res.json({ 
      status: 'success', 
      services: groupedServices,
      flatServices: services.map(s => ({
        id: s._id,
        name: s.name,
        price: s.price,
        duration: s.duration,
        description: s.description,
        category: s.category,
        employee: s.employee
      }))
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to fetch salon services', 
      error: error.message 
    });
  }
};

// Get professionals for a salon
exports.getSalonProfessionals = async (req, res) => {
  try {
    const { salonId } = req.params;
    
    const professionals = await Employee.find({ 
      salon: salonId, 
      isActive: true 
    })
    .select('name profileImage rating experience specialization totalBookings')
    .sort({ rating: -1, totalBookings: -1 });

    return res.json({ 
      status: 'success', 
      professionals: professionals.map(p => ({
        id: p._id,
        name: p.name,
        profileImage: p.profileImage,
        rating: p.rating,
        experience: p.experience,
        specialization: p.specialization,
        totalBookings: p.totalBookings
      }))
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to fetch salon professionals', 
      error: error.message 
    });
  }
};

// Get available time slots for a specific date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { salonId } = req.params;
    const { date, professionalId } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    // Get salon working hours
    const [openHour, openMinute] = salon.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = salon.closingTime.split(':').map(Number);
    
    // Generate time slots (30-minute intervals)
    const slots = [];
    const selectedDate = new Date(date);
    const today = new Date();
    
    // Don't allow booking for past dates
    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      return res.json({ status: 'success', slots: [] });
    }

    let currentHour = openHour;
    let currentMinute = openMinute;
    
    while (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute)) {
      const slotTime = new Date(selectedDate);
      slotTime.setHours(currentHour, currentMinute, 0, 0);
      
      // Skip past time slots for today
      if (selectedDate.toDateString() === today.toDateString() && slotTime <= today) {
        currentMinute += 30;
        if (currentMinute >= 60) {
          currentHour += 1;
          currentMinute = 0;
        }
        continue;
      }
      
      slots.push({
        time: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`,
        datetime: slotTime.toISOString(),
        available: true // We'll check availability below
      });
      
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }

    // Check existing bookings to mark unavailable slots
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    let bookingQuery = {
      salonId,
      appointmentTime: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $in: ['pending', 'confirmed'] }
    };

    // If specific professional is selected, check their availability
    if (professionalId) {
      // For now, we'll assume all professionals can take bookings
      // In a more advanced system, you'd check professional-specific availability
    }

    const existingBookings = await Booking.find(bookingQuery);
    
    // Mark slots as unavailable based on existing bookings
    existingBookings.forEach(booking => {
      const bookingTime = booking.appointmentTime;
      const bookingTimeStr = `${bookingTime.getHours().toString().padStart(2, '0')}:${bookingTime.getMinutes().toString().padStart(2, '0')}`;
      
      const slot = slots.find(s => s.time === bookingTimeStr);
      if (slot) {
        slot.available = false;
      }
    });

    return res.json({ 
      status: 'success', 
      slots: slots.filter(s => s.available),
      salonHours: {
        open: salon.openTime,
        close: salon.closingTime
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to fetch available slots', 
      error: error.message 
    });
  }
};

// Create booking with Fresha-style flow
exports.createFreshaBooking = async (req, res) => {
  try {
    const { 
      salonId, 
      services = [], 
      professionalId, 
      appointmentDate,
      appointmentTime,
      paymentMethod = 'pay_at_salon',
      notes = ''
    } = req.body;

    // Validation
    if (!salonId || !services.length || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ 
        message: 'salonId, services, appointmentDate, and appointmentTime are required' 
      });
    }

    // Validate services exist and calculate total
    const serviceIds = services.map(s => s.id);
    const validServices = await EmployeeService.find({ 
      _id: { $in: serviceIds }, 
      salon: salonId,
      isActive: true 
    });

    if (validServices.length !== services.length) {
      return res.status(400).json({ message: 'Some services are invalid or unavailable' });
    }

    // Create appointment datetime
    const [hours, minutes] = appointmentTime.split(':');
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Check if slot is still available
    const existingBooking = await Booking.findOne({
      salonId,
      appointmentTime: appointmentDateTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'This time slot is no longer available' });
    }

    // Calculate total price
    let totalPrice = validServices.reduce((sum, service) => sum + service.price, 0);

    // Apply first-booking discount if applicable
    let discountApplied = false;
    let discountAmount = 0;
    try {
      const user = await User.findById(req.user.id);
      if (user && user.referredBy && !user.firstBookingDiscountUsed) {
        discountAmount = Math.round((totalPrice * FIRST_BOOKING_DISCOUNT_PERCENT) / 100);
        totalPrice = Math.max(0, totalPrice - discountAmount);
        user.firstBookingDiscountUsed = true;
        await user.save();
        discountApplied = true;
      }
    } catch (e) {
      console.error('Discount application error:', e);
    }

    // Create booking
    const booking = await Booking.create({
      customerId: req.user.id,
      salonId,
      services: validServices.map(service => ({
        serviceId: service._id,
        name: service.name,
        price: service.price,
        durationMinutes: service.duration
      })),
      totalPrice,
      appointmentTime: appointmentDateTime,
      status: 'pending',
      notes,
      paymentStatus: paymentMethod === 'pay_online' ? 'pending' : 'pending'
    });

    // Populate booking for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('customerId', 'name phoneNumber email')
      .populate('salonId', 'name phoneNumber location.address');

    return res.status(201).json({
      status: 'success',
      booking: {
        id: populatedBooking.bookingId,
        customerId: populatedBooking.customerId._id,
        customerName: populatedBooking.customerId.name,
        customerPhone: populatedBooking.customerId.phoneNumber,
        salonId: populatedBooking.salonId._id,
        salonName: populatedBooking.salonId.name,
        salonPhone: populatedBooking.salonId.phoneNumber,
        services: populatedBooking.services,
        totalPrice: populatedBooking.totalPrice,
        originalPrice: totalPrice + discountAmount,
        discountApplied,
        discountAmount,
        appointmentTime: populatedBooking.appointmentTime,
        paymentMethod,
        status: populatedBooking.status,
        notes: populatedBooking.notes,
        createdAt: populatedBooking.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to create booking', 
      error: error.message 
    });
  }
};

// Get booking confirmation details
exports.getBookingConfirmation = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findOne({ bookingId })
      .populate('customerId', 'name phoneNumber email')
      .populate('salonId', 'name phoneNumber location.address location.city');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (req.user.role !== 'admin' && String(booking.customerId._id) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const confirmationDetails = {
      bookingId: booking.bookingId,
      customer: {
        name: booking.customerId.name,
        phone: booking.customerId.phoneNumber,
        email: booking.customerId.email
      },
      salon: {
        name: booking.salonId.name,
        phone: booking.salonId.phoneNumber,
        address: booking.salonId.location.address,
        city: booking.salonId.location.city
      },
      services: booking.services,
      totalPrice: booking.totalPrice,
      appointmentTime: booking.appointmentTime,
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt
    };

    return res.json({ 
      status: 'success', 
      booking: confirmationDetails 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to fetch booking confirmation', 
      error: error.message 
    });
  }
};
