// Salon Types
export interface Location {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  geolocation: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  mapUrl: string;
}

export interface Salon {
  _id: string;
  name: string;
  location: Location;
  verified: boolean;
  owner: string; // SaloonUser ID
  image: string[];
  thumbnails?: string[];
  rating?: number;
  reviews?: number;
  badge?: 'Premium' | 'Popular' | 'Top Rated';
  services: SalonService[];
  amenities: Amenity[];
  openTime: string;
  closingTime: string;
  availability: 'Available Now' | 'Busy';
  phone: string;
  description: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SalonService = 
  | 'Haircut'
  | 'Hair Styling'
  | 'Hair Wash'
  | 'Hair Coloring'
  | 'Hair Treatment'
  | 'Beard Trim'
  | 'Shaving'
  | 'Mustache Styling'
  | 'Facial'
  | 'Face Cleanup'
  | 'Head Massage'
  | 'Hair Spa'
  | 'Eyebrow Threading'
  | 'Manicure'
  | 'Pedicure'
  | 'Waxing'
  | 'Bleaching'
  | 'Bridal Makeup'
  | 'Party Makeup'
  | 'Hair Straightening'
  | 'Hair Curling'
  | 'Keratin Treatment'
  | 'Scalp Treatment';

export type Amenity = 'AC' | 'Parking' | 'WiFi' | 'Coffee';

export type Badge = 'Premium' | 'Popular' | 'Top Rated';

export type Availability = 'Available Now' | 'Busy';

// Request/Response Types
export interface CreateSalonRequest {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  mapUrl: string;
  image: File[] | string[]; // Files for upload or URLs
  owner: string; // SaloonUser ID - required for creating salon

  badge?: Badge;
  services: SalonService[];
  amenities: Amenity[];
  openTime: string;
  closingTime: string;
  availability: Availability;
  phone: string;
  description: string;
  featured?: boolean;
}

export interface UpdateSalonRequest extends Partial<CreateSalonRequest> {
  _id: string;
}

export interface SalonListResponse {
  status: 'success';
  salons: Salon[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SalonResponse {
  status: 'success';
  salon: Salon;
}

export interface SalonCountResponse {
  status: 'success';
  count: number;
}

// Search Types
export interface LocationSearchParams {
  city?: string;
  state?: string;
  pincode?: string;
  page?: number;
  limit?: number;
}

export interface NearbySearchParams {
  latitude: number;
  longitude: number;
  maxDistance?: number;
  page?: number;
  limit?: number;
}

export interface ServiceSearchParams {
  services: SalonService[];
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
}

// Store Types
export interface SalonState {
  salons: Salon[];
  currentSalon: Salon | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  lastFetched: number; // epoch ms when salons were last fetched/refreshed
}

export interface SalonActions {
  // CRUD Operations
  createSalon: (salonData: CreateSalonRequest) => Promise<{ success: boolean; data?: Salon; error?: string }>;
  getSalons: (userId?: string) => Promise<{ success: boolean; data?: Salon[]; error?: string }>;
  getSalonById: (id: string) => Promise<{ success: boolean; data?: Salon; error?: string }>;
  updateSalon: (salonData: UpdateSalonRequest) => Promise<{ success: boolean; data?: Salon; error?: string }>;
  deleteSalon: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Search Operations
  searchByLocation: (params: LocationSearchParams) => Promise<{ success: boolean; data?: SalonListResponse; error?: string }>;
  searchNearby: (params: NearbySearchParams) => Promise<{ success: boolean; data?: SalonListResponse; error?: string }>;
  searchByServices: (params: ServiceSearchParams) => Promise<{ success: boolean; data?: SalonListResponse; error?: string }>;
  
  // User-specific Operations
  getUserSalons: (userId: string) => Promise<{ success: boolean; data?: Salon[]; error?: string }>;
  getUserSalonCount: (userId: string) => Promise<{ success: boolean; count?: number; error?: string }>;
  
  // Utility Actions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setCurrentSalon: (salon: Salon | null) => void;
}

export type SalonStore = SalonState & SalonActions;

// Form Types
export interface SalonFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string; // Form input as string
  longitude: string; // Form input as string
  mapUrl: string;
  images: FileList | null;
  rating: string; // Form input as string
  reviews: string; // Form input as string
  badge: Badge | '';
  services: SalonService[];
  amenities: Amenity[];
  openTime: string;
  closingTime: string;
  availability: Availability;
  phone: string;
  description: string;
  featured: boolean;
}
