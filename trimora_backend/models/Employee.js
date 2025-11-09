const mongoose = require("mongoose")

const employeeSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Employee email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
      index: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
      index: true,
    },

    // Salon Reference
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: [true, "Salon reference is required"],
      index: true,
    },

    // SalonUser Reference (for easy fetching by user)
    salonUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SaloonUser",
      required: [true, "SalonUser reference is required"],
      index: true,
    },

    // Working hours
    workingHours: {
      monday: {
        isWorking: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },
      tuesday: {
        isWorking: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },
      wednesday: {
        isWorking: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },
      thursday: {
        isWorking: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },
      friday: {
        isWorking: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },
      saturday: {
        isWorking: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },
      sunday: {
        isWorking: { type: Boolean, default: false },
        startTime: { type: String, default: "10:00" },
        endTime: { type: String, default: "16:00" },
      },
    },

    // Employee status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Experience and rating
    experience: {
      type: Number, // in years
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
      index: true,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },

    // Profile image
    profileImage: {
      type: String,
      default: null,
    },

    // Specialization
    specialization: [
      {
        type: String,
        enum: ["Hair Specialist", "Beard Expert", "Color Expert", "Styling Expert", "Facial Expert"],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes
employeeSchema.index({ salon: 1, isActive: 1 })
employeeSchema.index({ rating: -1 })

// Virtual for average rating
employeeSchema.virtual("averageRating").get(function () {
  return this.rating || 5.0
})

module.exports = mongoose.model("Employee", employeeSchema)
