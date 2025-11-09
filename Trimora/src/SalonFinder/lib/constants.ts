export const SALON_SERVICES = [
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
  "Scalp Treatment",
] as const

export const SALON_AMENITIES = ["AC", "Parking", "WiFi", "Coffee"] as const

export const AVAILABILITY_OPTIONS = ["Available Now", "Busy"] as const

// API base segments
const API_BASE = process.env.NEXT_PUBLIC_API_URL_BASE || "http://localhost:5000/api/v1"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${API_BASE}/saloon`
export const API_EMPLOYEE_URL = `${API_BASE}/employee`
export const API_EMPLOYEE_SERVICE_URL = `${API_BASE}/employee-service`
