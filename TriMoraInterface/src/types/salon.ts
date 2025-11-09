export interface Salon {
  id: number
  name: string
  description: string
  location: string
  address: string
  city: string
  state: string
  pincode: string
  verified: boolean
  ownerId: number
  ownerName: string
  ownerPhone: string
  ownerEmail: string
  
  // Images
  mainImage: string
  gallery: string[]
  thumbnails: string[]
  
  // Ratings & Reviews
  rating: number
  reviews: number
  totalBookings: number
  
  // Services & Pricing
  services: string[]
  detailedServices: ServiceDetail[]
  amenities: string[]
  
  // Pricing
  originalPrice: number
  currentPrice: number
  discount: number
  
  // Status & Badges
  status: 'Active' | 'Pending' | 'Inactive' | 'Suspended'
  badge: string
  featured: boolean
  
  // Location & Distance
  distance: string
  coordinates: {
    lat: number
    lng: number
  }
  
  // Timing
  openTime: string
  closeTime: string
  workingDays: string[]
  availability: 'Available Now' | 'Busy' | 'Closed'
  nextSlot: string
  
  // Additional Info
  phone: string
  whatsapp?: string
  email?: string
  website?: string
  
  // Timestamps
  createdAt: string
  updatedAt: string
  approvedAt?: string
}

export interface ServiceDetail {
  id: number
  name: string
  description: string
  price: number
  duration: string // "30 min", "45 min", etc.
  category: string
  available: boolean
}

export interface SalonOwner {
  id: number
  name: string
  email: string
  phone: string
  avatar?: string
  totalSalons: number
  totalBookings: number
  totalRevenue: number
  joinedDate: string
  verified: boolean
}
