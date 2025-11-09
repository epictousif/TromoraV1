import salonApi from './salonApi';
import type { 
  Salon,
  CreateSalonRequest, 
  UpdateSalonRequest,
  SalonListResponse,
  SalonCountResponse,
  LocationSearchParams,
  NearbySearchParams,
  ServiceSearchParams
} from '../types/salon';

function normalizeSalon(input: any): Salon {
  const images: string[] = Array.isArray(input?.images)
    ? input.images
    : (Array.isArray(input?.image) ? input.image : (input?.image ? [input.image] : []));

  const owner: string = typeof input?.owner === 'object' && input?.owner !== null
    ? String(input.owner._id || '')
    : String(input?.owner || '');

  // Build a consistent location object from nested or flat fields
  const locIn = input?.location ?? {};
  const address = (locIn?.address ?? input?.address ?? '').toString();
  const city = (locIn?.city ?? input?.city ?? '').toString();
  const state = (locIn?.state ?? input?.state ?? '').toString();
  const pincode = (locIn?.pincode ?? input?.pincode ?? '').toString();
  const latitudeRaw = locIn?.coordinates?.latitude ?? input?.latitude;
  const longitudeRaw = locIn?.coordinates?.longitude ?? input?.longitude;
  const latitude = latitudeRaw !== undefined && latitudeRaw !== null ? Number(latitudeRaw) : NaN;
  const longitude = longitudeRaw !== undefined && longitudeRaw !== null ? Number(longitudeRaw) : NaN;
  const mapUrl = (locIn?.mapUrl ?? input?.mapUrl ?? '').toString();

  const location = {
    address,
    city,
    state,
    pincode,
    coordinates: {
      latitude: isNaN(latitude) ? 0 : latitude,
      longitude: isNaN(longitude) ? 0 : longitude,
    },
    geolocation: {
      type: 'Point' as const,
      coordinates: [
        isNaN(longitude) ? 0 : longitude,
        isNaN(latitude) ? 0 : latitude,
      ] as [number, number],
    },
    mapUrl,
  };

  // Coerce arrays
  const services: string[] = Array.isArray(input?.services)
    ? input.services
    : (typeof input?.services === 'string' && input.services.includes(',')
        ? input.services.split(',').map((s: string) => s.trim()).filter(Boolean)
        : (input?.services ? [String(input.services)] : []));

  const amenities: string[] = Array.isArray(input?.amenities)
    ? input.amenities
    : (typeof input?.amenities === 'string' && input.amenities.includes(',')
        ? input.amenities.split(',').map((s: string) => s.trim()).filter(Boolean)
        : (input?.amenities ? [String(input.amenities)] : []));

  const rating = input?.rating !== undefined ? Number(input.rating) : undefined;
  const reviews = input?.reviews !== undefined ? Number(input.reviews) : undefined;
  const phone = input?.phone !== undefined ? String(input.phone) : '';

  return {
    ...(input as any),
    _id: String(input?._id || ''),
    owner,
    image: images,
    location,
    services,
    amenities,
    rating: Number.isNaN(rating as number) ? undefined : rating,
    reviews: Number.isNaN(reviews as number) ? undefined : reviews,
    phone,
  } as Salon;
}

export class SalonService {
  // Create a new salon
  static async createSalon(salonData: CreateSalonRequest): Promise<Salon> {
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('name', salonData.name);
      formData.append('address', salonData.address);
      formData.append('city', salonData.city);
      formData.append('state', salonData.state);
      formData.append('pincode', salonData.pincode);
      formData.append('latitude', salonData.latitude.toString());
      formData.append('longitude', salonData.longitude.toString());
      formData.append('mapUrl', salonData.mapUrl);
      formData.append('owner', salonData.owner);

      formData.append('openTime', salonData.openTime);
      formData.append('closingTime', salonData.closingTime);
      formData.append('availability', salonData.availability);
      formData.append('phone', salonData.phone);
      formData.append('description', salonData.description);
      
      // Add optional fields
      if (salonData.badge) formData.append('badge', salonData.badge);
      if (salonData.featured !== undefined) formData.append('featured', salonData.featured.toString());
      
      // Add arrays
      salonData.services.forEach(service => formData.append('services', service));
      salonData.amenities.forEach(amenity => formData.append('amenities', amenity));
      
      // Add images
      if (Array.isArray(salonData.image) && salonData.image.length > 0) {
        if (salonData.image[0] instanceof File) {
          // File upload
          (salonData.image as File[]).forEach(file => formData.append('images', file));
        } else {
          // URL strings
          (salonData.image as string[]).forEach(url => formData.append('image', url));
        }
      }
      
      const response = await salonApi.post<any>('saloon', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const raw = response.data;
      return normalizeSalon(raw?.salon ?? raw);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create salon');
    }
  }

  // Get all salons
  static async getAllSalons(): Promise<Salon[]> {
    try {
      const response = await salonApi.get<any>(`getAllSalons?_ts=${Date.now()}`);
      const raw = response.data;
      const arr = Array.isArray(raw) ? raw : (Array.isArray(raw?.salons) ? raw.salons : []);
      return arr.map(normalizeSalon);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch salons');
    }
  }

  // Get salon by ID
  static async getSalonById(id: string): Promise<Salon> {
    try {
      if (!id) throw new Error('Missing salon id');
      const response = await salonApi.get<any>(`getSalon/${id}?_ts=${Date.now()}`);
      const raw = response.data;
      return normalizeSalon(raw?.salon ?? raw);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch salon');
    }
  }

  // Update salon
  static async updateSalon(salonData: UpdateSalonRequest): Promise<Salon> {
    try {
      const formData = new FormData();
      
      // Add all fields that are present
      Object.entries(salonData).forEach(([key, value]) => {
        if (value !== undefined && key !== '_id' && key !== 'image') {
          if (Array.isArray(value)) {
            value.forEach(item => formData.append(key, item));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Handle images separately
      if (salonData.image) {
        if (Array.isArray(salonData.image) && salonData.image.length > 0) {
          if (salonData.image[0] instanceof File) {
            // File upload
            (salonData.image as File[]).forEach(file => formData.append('images', file));
          } else {
            // URL strings
            (salonData.image as string[]).forEach(url => formData.append('image', url));
          }
        }
      }
      
      const response = await salonApi.put<any>(`updateSalon/${salonData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const raw = response.data;
      return normalizeSalon(raw?.salon ?? raw);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update salon');
    }
  }

  // Delete salon
  static async deleteSalon(id: string): Promise<void> {
    try {
      await salonApi.delete(`deleteSalon/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete salon');
    }
  }

  // Get salons by user ID (names and IDs only)
  static async getSalonsByUserId(userId: string): Promise<Salon[]> {
    try {
      const response = await salonApi.get<any>(`user/${userId}?_ts=${Date.now()}`);
      const raw = response.data;
      const arr = Array.isArray(raw) ? raw : (Array.isArray(raw?.salons) ? raw.salons : []);
      return arr.map(normalizeSalon);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user salons');
    }
  }

  // Get salons by user ID with full details
  static async getSalonsByUserIdWithDetails(userId: string): Promise<Salon[]> {
    try {
      const response = await salonApi.get<any>(`user/${userId}/details?_ts=${Date.now()}`);
      const raw = response.data;
      const arr = Array.isArray(raw) ? raw : (Array.isArray(raw?.salons) ? raw.salons : []);
      return arr.map(normalizeSalon);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user salon details');
    }
  }

  // Get salon count by user ID
  static async getSalonCountByUserId(userId: string): Promise<number> {
    try {
      const response = await salonApi.get<SalonCountResponse>(`user/${userId}/count?_ts=${Date.now()}`);
      return response.data.count;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch salon count');
    }
  }

  // Search salons by location
  static async searchByLocation(params: LocationSearchParams): Promise<SalonListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.city) queryParams.append('city', params.city);
      if (params.state) queryParams.append('state', params.state);
      if (params.pincode) queryParams.append('pincode', params.pincode);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await salonApi.get<SalonListResponse>(`search/location?${queryParams}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search salons by location');
    }
  }

  // Search nearby salons
  static async searchNearby(params: NearbySearchParams): Promise<SalonListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append('latitude', params.latitude.toString());
      queryParams.append('longitude', params.longitude.toString());
      if (params.maxDistance) queryParams.append('maxDistance', params.maxDistance.toString());
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await salonApi.get<SalonListResponse>(`search/nearby?${queryParams}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search nearby salons');
    }
  }

  // Search salons by services
  static async searchByServices(params: ServiceSearchParams): Promise<SalonListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append('services', params.services.join(','));
      if (params.city) queryParams.append('city', params.city);
      if (params.state) queryParams.append('state', params.state);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await salonApi.get<SalonListResponse>(`search/services?${queryParams}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search salons by services');
    }
  }
}
