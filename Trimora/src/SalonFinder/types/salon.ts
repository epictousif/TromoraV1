export interface Salon {
  _id: string
  name: string
  location: {
    address: string
    city: string
    state: string
    pincode: string
    coordinates: {
      latitude: number
      longitude: number
    }
    geolocation: {
      type: string
      coordinates: [number, number]
    }
    mapUrl: string
  }
  verified: boolean
  owner: string
  image: string[]
  thumbnails?: string[]
  rating: number
  reviews: number
  badge?: "Premium" | "Popular" | "Top Rated"
  services: string[]
  amenities: string[]
  openTime: string
  closingTime: string
  availability: "Available Now" | "Busy"
  phone: string
  description: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface SalonFilters {
  services: string[]
  amenities: string[]
  availability: string
  city: string
  state: string
  pincode: string
}

export interface SearchParams {
  query?: string
  latitude?: number
  longitude?: number
  maxDistance?: number
  page?: number
  limit?: number
}
