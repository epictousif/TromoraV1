const mongoose = require("mongoose")

const employeeServiceSchema = new mongoose.Schema(
  {
    // Employee reference
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee reference is required"],
      index: true,
    },

    // Salon reference (for easy querying)
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: [true, "Salon reference is required"],
      index: true,
    },

    // SalonUser reference (for easy querying)
    salonUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SaloonUser",
      required: [true, "SalonUser reference is required"],
      index: true,
    },

    // Service details
    name: {
      type: String,
      required: [true, "Service name is required"],
      enum: [
        "Hair Cut",
        "Hair Wash",
        "Beard Trim",
        "Shave",
        "Hair Color",
        "Hair Style",
        "Facial",
        "Massage",
        "Manicure",
        "Pedicure",
      ],
      index: true,
    },

    duration: {
      type: Number, // in minutes
      required: [true, "Service duration is required"],
      min: 15,
      max: 180,
    },

    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: 0,
    },

    // Service status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Service description
    description: {
      type: String,
      default: "",
    },

    // Service category
    category: {
      type: String,
      enum: ["Hair", "Beard", "Facial", "Nail", "Massage"],
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes
employeeServiceSchema.index({ employee: 1, isActive: 1 })
employeeServiceSchema.index({ salon: 1, isActive: 1 })
employeeServiceSchema.index({ salonUser: 1, isActive: 1 })
employeeServiceSchema.index({ name: 1, category: 1 })
employeeServiceSchema.index({ price: 1 })
employeeServiceSchema.index({ salon: 1, employee: 1 })

// Virtual for formatted duration
employeeServiceSchema.virtual("durationFormatted").get(function () {
  const hours = Math.floor(this.duration / 60)
  const minutes = this.duration % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
})

// Virtual for formatted price
employeeServiceSchema.virtual("priceFormatted").get(function () {
  return `₹${this.price}`
})

module.exports = mongoose.model("EmployeeService", employeeServiceSchema) 