const mongoose = require("mongoose")

const salonSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true, index: true },

    // Complete Location with Geolocation
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true, index: true },
      pincode: { type: String, required: true, index: true },
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
      },
      geolocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number] // [longitude, latitude]
      },
      mapUrl: { type: String, required: true } // Direct map coordinate URL
    },

    verified: { type: Boolean, default: false },

    // Owner Reference
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SaloonUser", // Reference to SaloonUser model
      required: true,
      index: true,
    },

    // Media
    image: [{ type: String, required: true }],
    thumbnails: [{ type: String }],

    // Metadata
    rating: { type: Number, default: 0, index: true },
    reviews: { type: Number, default: 0 },
    badge: {
      type: String,
      enum: ["Premium", "Popular", "Top Rated"],
      index: true,
    },

    // Services - Salon related services with enum
    services: [{
      type: String,
      enum: [
        "Haircut",
        "Hair Styling",
        "Hair Wash",
        "Hair Coloring",
        "Hair Treatment",
        "Beard Trim",
        "Shaving",
        "Mustache Styling",
        "Facial",
        "Face Cleanup",
        "Head Massage",
        "Hair Spa",
        "Eyebrow Threading",
        "Manicure",
        "Pedicure",
        "Waxing",
        "Bleaching",
        "Bridal Makeup",
        "Party Makeup",
        "Hair Straightening",
        "Hair Curling",
        "Keratin Treatment",
        "Scalp Treatment"
      ],
      index: true
    }],

    // Amenities
    amenities: [
      {
        type: String,
        enum: ["AC", "Parking", "WiFi", "Coffee"],
        index: true,
      },
    ],

    // Timing - added closingTime
    openTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    availability: {
      type: String,
      enum: ["Available Now", "Busy"],
      required: true,
      index: true,
    },

    // Contact
    phone: { type: String, required: true, index: true },
    description: { type: String, required: true },

    // Flags
    featured: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Geospatial Index for location-based queries
salonSchema.index({ "location.geolocation": "2dsphere" })

// Compound Indexes
salonSchema.index({
  rating: -1,
  amenities: 1,
})

salonSchema.index({
  amenities: 1,
  availability: 1,
  featured: 1,
})

// Location-based indexes
salonSchema.index({
  "location.city": 1,
  "location.state": 1,
  rating: -1
})

salonSchema.index({
  "location.pincode": 1,
  availability: 1
})

module.exports = mongoose.model("Salon", salonSchema)