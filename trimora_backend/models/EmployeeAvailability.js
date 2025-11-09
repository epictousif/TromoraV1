const mongoose = require("mongoose")

// Time slot schema for individual slots
const timeSlotSchema = new mongoose.Schema(
  {
    startTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM"],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM"],
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeService",
      default: null,
    },
    duration: {
      type: Number, // in minutes
      default: 45,
      max: 180,
    },
    bookingNotes: {
      type: String,
      default: "",
    },
  },
  { _id: true },
)

const employeeAvailabilitySchema = new mongoose.Schema(
  {
    // Employee reference
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee reference is required"],
      index: true,
    },

    // Date for this availability
    date: {
      type: Date,
      required: [true, "Date is required"],
      index: true,
    },

    // Time slots for this date
    slots: [timeSlotSchema],

    // Availability status for the day
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Notes for the day
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes
employeeAvailabilitySchema.index({ employee: 1, date: 1 }, { unique: true })
employeeAvailabilitySchema.index({ date: 1, isAvailable: 1 })
employeeAvailabilitySchema.index({ "slots.isBooked": 1 })

// Virtual for available slots count
employeeAvailabilitySchema.virtual("availableSlotsCount").get(function () {
  return this.slots.filter((slot) => !slot.isBooked).length
})

// Virtual for booked slots count
employeeAvailabilitySchema.virtual("bookedSlotsCount").get(function () {
  return this.slots.filter((slot) => slot.isBooked).length
})

// Virtual for total slots count
employeeAvailabilitySchema.virtual("totalSlotsCount").get(function () {
  return this.slots.length
})

// Method to generate time slots for a specific date
employeeAvailabilitySchema.methods.generateTimeSlots = function (slotDuration = 45) {
  const Employee = mongoose.model("Employee")
  
  return Employee.findById(this.employee).then((employee) => {
    if (!employee) {
      throw new Error("Employee not found")
    }

    const dayName = new Date(this.date).toLocaleLowerCase().slice(0, 3) // mon, tue, etc.
    const dayMapping = {
      sun: "sunday",
      mon: "monday",
      tue: "tuesday",
      wed: "wednesday",
      thu: "thursday",
      fri: "friday",
      sat: "saturday",
    }

    const workingDay = employee.workingHours[dayMapping[dayName]]

    if (!workingDay.isWorking) {
      return []
    }

    const slots = []
    const [startHour, startMin] = workingDay.startTime.split(":").map(Number)
    const [endHour, endMin] = workingDay.endTime.split(":").map(Number)

    let currentTime = startHour * 60 + startMin // Convert to minutes
    const endTime = endHour * 60 + endMin

    while (currentTime + slotDuration <= endTime) {
      const startTimeStr = `${Math.floor(currentTime / 60)
        .toString()
        .padStart(2, "0")}:${(currentTime % 60).toString().padStart(2, "0")}`

      const endTimeMinutes = currentTime + slotDuration
      const endTimeStr = `${Math.floor(endTimeMinutes / 60)
        .toString()
        .padStart(2, "0")}:${(endTimeMinutes % 60).toString().padStart(2, "0")}`

      slots.push({
        startTime: startTimeStr,
        endTime: endTimeStr,
        isBooked: false,
        duration: slotDuration,
      })

      currentTime += slotDuration
    }

    return slots
  })
}

// Method to book a slot
employeeAvailabilitySchema.methods.bookSlot = function (slotIndex, userId, serviceId, notes = "") {
  if (slotIndex < 0 || slotIndex >= this.slots.length) {
    throw new Error("Invalid slot index")
  }

  const slot = this.slots[slotIndex]
  if (slot.isBooked) {
    throw new Error("Slot is already booked")
  }

  slot.isBooked = true
  slot.bookedBy = userId
  slot.service = serviceId
  slot.bookingNotes = notes

  return this.save()
}

// Method to cancel a booking
employeeAvailabilitySchema.methods.cancelBooking = function (slotIndex) {
  if (slotIndex < 0 || slotIndex >= this.slots.length) {
    throw new Error("Invalid slot index")
  }

  const slot = this.slots[slotIndex]
  if (!slot.isBooked) {
    throw new Error("Slot is not booked")
  }

  slot.isBooked = false
  slot.bookedBy = null
  slot.service = null
  slot.bookingNotes = ""

  return this.save()
}

module.exports = mongoose.model("EmployeeAvailability", employeeAvailabilitySchema) 