import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { tokenManager } from './api';

// API Base URL for salon routes
const SALON_API_BASE_URL = 'http://localhost:5000/api/v1/saloon/';

// Create salon-specific axios instance
const salonApi: AxiosInstance = axios.create({
  baseURL: SALON_API_BASE_URL,
  timeout: 30000, // Longer timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
salonApi.interceptors.request.use(
  (config) => {
    const tokens = tokenManager.getTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
salonApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const tokens = tokenManager.getTokens();
        if (tokens?.refreshToken) {
          const refreshResponse = await axios.post('http://localhost:5000/api/v1/saloonUser/refresh', {
            refreshToken: tokens.refreshToken
          });

          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem('salon_accessToken', newAccessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return salonApi(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        tokenManager.clearTokens();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default salonApi;
