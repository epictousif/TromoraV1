import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { AuthTokens } from '../types/auth';

// API Base URL - adjust according to your backend
const API_BASE_URL = 'https://tromora-v1-b8fdk67zz-tousifhassana-8941s-projects.vercel.app/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management utilities
export const tokenManager = {
  getTokens: (): AuthTokens | null => {
    const accessToken = localStorage.getItem('salon_accessToken');
    const refreshToken = localStorage.getItem('salon_refreshToken');
    
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    return null;
  },

  setTokens: (tokens: AuthTokens): void => {
    localStorage.setItem('salon_accessToken', tokens.accessToken);
    localStorage.setItem('salon_refreshToken', tokens.refreshToken);
  },

  clearTokens: (): void => {
    localStorage.removeItem('salon_accessToken');
    localStorage.removeItem('salon_refreshToken');
    localStorage.removeItem('salon_user');
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem('salon_accessToken');
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem('salon_refreshToken');
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenManager.getAccessToken();
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          tokenManager.clearTokens();
          window.location.href = '/';
          return Promise.reject(error);
        }

        // Try to refresh the token
        const refreshResponse = await axios.post(`${API_BASE_URL}/saloonUser/refresh`, {
          refreshToken
        });

        const newAccessToken = refreshResponse.data.accessToken;
        
        // Update the access token
        localStorage.setItem('salon_accessToken', newAccessToken);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

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

export default api;
