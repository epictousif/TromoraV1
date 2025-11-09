const EmployeeAvailability = require("../models/EmployeeAvailability")
const Employee = require("../models/Employee")
const EmployeeService = require("../models/EmployeeService")
const redisClient = require("../utils/redisClient")

// Create availability for an employee
exports.createAvailability = async (req, res) => {
  try {
    const { employeeId } = req.params
    const { date, slotDuration = 45, notes } = req.body

    // Check if employee exists
    const employee = await Employee.findById(employeeId)
    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found"
      })
    }

    // Check if availability already exists for this date
    const existingAvailability = await EmployeeAvailability.findOne({
      employee: employeeId,
      date: new Date(date)
    })

    if (existingAvailability) {
      return res.status(400).json({
        status: "error",
        message: "Availability already exists for this date"
      })
    }

    // Create new availability
    const availability = new EmployeeAvailability({
      employee: employeeId,
      date: new Date(date),
      notes: notes || ""
    })

    // Generate time slots
    const slots = await availability.generateTimeSlots(slotDuration)
    availability.slots = slots

    await availability.save()

    // Clear related caches
    await redisClient.del(`employee:${employeeId}`)
    await redisClient.del(`availability:${employeeId}`)

    res.status(201).json({
      status: "success",
      message: "Availability created successfully",
      availability
    })
  } catch (error) {
    console.error("Error creating availability:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to create availability",
      error: error.message
    })
  }
}

// Get availability for an employee
exports.getEmployeeAvailability = async (req, res) => {
  try {
    const { employeeId } = req.params
    const { startDate, endDate, isAvailable } = req.query

    const cacheKey = `availability:${employeeId}:${startDate}:${endDate}:${isAvailable || "all"}`
    let availability = await redisClient.get(cacheKey)

    if (availability) {
      availability = JSON.parse(availability)
      return res.json({
        status: "success",
        source: "cache",
        availability
      })
    }

    const filter = { employee: employeeId }
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }
    
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === "true"
    }

    availability = await EmployeeAvailability.find(filter)
      .populate("employee", "name email")
      .sort({ date: 1 })
      .lean()

    // Cache for 5 minutes
    await redisClient.set(cacheKey, JSON.stringify(availability), { EX: 300 })

    res.json({
      status: "success",
      source: "database",
      count: availability.length,
      availability
    })
  } catch (error) {
    console.error("Error fetching availability:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch availability",
      error: error.message
    })
  }
}

// Get availability by ID
exports.getAvailabilityById = async (req, res) => {
  try {
    const { id } = req.params

    const availability = await EmployeeAvailability.findById(id)
      .populate("employee", "name email")
      .lean()

    if (!availability) {
      return res.status(404).json({
        status: "error",
        message: "Availability not found"
      })
    }

    res.json({
      status: "success",
      availability
    })
  } catch (error) {
    console.error("Error fetching availability:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch availability",
      error: error.message
    })
  }
}

// Update availability
exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const availability = await EmployeeAvailability.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("employee", "name email")

    if (!availability) {
      return res.status(404).json({
        status: "error",
        message: "Availability not found"
      })
    }

    // Clear related caches
    await redisClient.del(`employee:${availability.employee._id}`)
    await redisClient.del(`availability:${availability.employee._id}`)

    res.json({
      status: "success",
      message: "Availability updated successfully",
      availability
    })
  } catch (error) {
    console.error("Error updating availability:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to update availability",
      error: error.message
    })
  }
}

// Delete availability
exports.deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params

    const availability = await EmployeeAvailability.findByIdAndDelete(id)
    if (!availability) {
      return res.status(404).json({
        status: "error",
        message: "Availability not found"
      })
    }

    // Clear related caches
    await redisClient.del(`employee:${availability.employee}`)
    await redisClient.del(`availability:${availability.employee}`)

    res.json({
      status: "success",
      message: "Availability deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting availability:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to delete availability",
      error: error.message
    })
  }
}

// Book a slot
exports.bookSlot = async (req, res) => {
  try {
    const { id } = req.params
    const { slotIndex, userId, serviceId, notes } = req.body

    const availability = await EmployeeAvailability.findById(id)
    if (!availability) {
      return res.status(404).json({
        status: "error",
        message: "Availability not found"
      })
    }

    // Check if service exists
    if (serviceId) {
      const service = await EmployeeService.findById(serviceId)
      if (!service) {
        return res.status(404).json({
          status: "error",
          message: "Service not found"
        })
      }
    }

    await availability.bookSlot(slotIndex, userId, serviceId, notes)

    // Clear related caches
    await redisClient.del(`employee:${availability.employee}`)
    await redisClient.del(`availability:${availability.employee}`)

    res.json({
      status: "success",
      message: "Slot booked successfully",
      availability
    })
  } catch (error) {
    console.error("Error booking slot:", error)
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to book slot",
      error: error.message
    })
  }
}

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params
    const { slotIndex } = req.body

    const availability = await EmployeeAvailability.findById(id)
    if (!availability) {
      return res.status(404).json({
        status: "error",
        message: "Availability not found"
      })
    }

    await availability.cancelBooking(slotIndex)

    // Clear related caches
    await redisClient.del(`employee:${availability.employee}`)
    await redisClient.del(`availability:${availability.employee}`)

    res.json({
      status: "success",
      message: "Booking cancelled successfully",
      availability
    })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to cancel booking",
      error: error.message
    })
  }
}

// Generate time slots for a date
exports.generateTimeSlots = async (req, res) => {
  try {
    const { employeeId } = req.params
    const { date, slotDuration = 45 } = req.body

    const employee = await Employee.findById(employeeId)
    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found"
      })
    }

    // Create temporary availability object to use the method
    const tempAvailability = new EmployeeAvailability({
      employee: employeeId,
      date: new Date(date)
    })

    const slots = await tempAvailability.generateTimeSlots(slotDuration)

    res.json({
      status: "success",
      date,
      slots,
      count: slots.length
    })
  } catch (error) {
    console.error("Error generating time slots:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to generate time slots",
      error: error.message
    })
  }
}

// Get available slots for a date range
exports.getAvailableSlots = async (req, res) => {
  try {
    const { employeeId } = req.params
    const { startDate, endDate } = req.query

    const filter = { employee: employeeId }
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    const availability = await EmployeeAvailability.find(filter)
      .populate("employee", "name email")
      .sort({ date: 1 })
      .lean()

    // Extract available slots
    const availableSlots = availability.map(avail => ({
      date: avail.date,
      availableSlots: avail.slots.filter(slot => !slot.isBooked),
      totalSlots: avail.slots.length,
      availableCount: avail.slots.filter(slot => !slot.isBooked).length
    }))

    res.json({
      status: "success",
      count: availability.length,
      availability: availableSlots
    })
  } catch (error) {
    console.error("Error fetching available slots:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch available slots",
      error: error.message
    })
  }
}

// Get booking statistics
exports.getBookingStats = async (req, res) => {
  try {
    const { employeeId } = req.params
    const { startDate, endDate } = req.query

    const filter = { employee: employeeId }
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    const availability = await EmployeeAvailability.find(filter).lean()

    let totalSlots = 0
    let bookedSlots = 0
    let availableSlots = 0

    availability.forEach(avail => {
      totalSlots += avail.slots.length
      bookedSlots += avail.slots.filter(slot => slot.isBooked).length
      availableSlots += avail.slots.filter(slot => !slot.isBooked).length
    })

    const stats = {
      totalSlots,
      bookedSlots,
      availableSlots,
      bookingRate: totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0,
      availabilityCount: availability.length
    }

    res.json({
      status: "success",
      stats
    })
  } catch (error) {
    console.error("Error fetching booking stats:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch booking statistics",
      error: error.message
    })
  }
} 