// API configuration
const API_BASE_URL = 'http://localhost:3000';

export const api = {
  baseURL: API_BASE_URL,
  
  // Helper method to make authenticated requests
  request: async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };
    
    const response = await fetch(url, config);
    return response;
  },

  // Fresha booking endpoints
  fresha: {
    getSalonServices: (salonId: string) => 
      api.request(`/api/v1/fresha/salon/${salonId}/services`),
    
    getSalonProfessionals: (salonId: string) => 
      api.request(`/api/v1/fresha/salon/${salonId}/professionals`),
    
    getAvailableSlots: (salonId: string, params: URLSearchParams) => 
      api.request(`/api/v1/fresha/salon/${salonId}/slots?${params}`),
    
    createBooking: (bookingData: any) => 
      api.request('/api/v1/fresha/book', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      }),
    
    getBookingConfirmation: (bookingId: string) => 
      api.request(`/api/v1/fresha/confirmation/${bookingId}`),
  }
};

export default api;
