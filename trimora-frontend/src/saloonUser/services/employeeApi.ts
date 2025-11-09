import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { tokenManager } from './api';

// API Base URL for employee routes
const EMPLOYEE_API_BASE_URL = 'https://tromora-v1-b8fdk67zz-tousifhassana-8941s-projects.vercel.app/api/v1/employee/';

const employeeApi: AxiosInstance = axios.create({
  baseURL: EMPLOYEE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    // Prevent any intermediary caches for authenticated data
    'Cache-Control': 'no-store',
  },
});

employeeApi.interceptors.request.use(
  (config) => {
    const tokens = tokenManager.getTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    // Cache-bust GET requests to avoid stale reads after write
    if ((config.method || 'get').toLowerCase() === 'get') {
      const ts = Date.now().toString();
      config.params = { ...(config.params || {}), _ts: ts };
      // Also ensure no-store on request headers
      config.headers['Cache-Control'] = 'no-store';
      config.headers['Pragma'] = 'no-cache';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

employeeApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const tokens = tokenManager.getTokens();
        if (tokens?.refreshToken) {
          const refreshResponse = await axios.post('https://tromora-v1-b8fdk67zz-tousifhassana-8941s-projects.vercel.app/api/v1/saloonUser/refresh', {
            refreshToken: tokens.refreshToken,
          });
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem('salon_accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return employeeApi(originalRequest);
        }
      } catch (refreshError) {
        tokenManager.clearTokens();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default employeeApi;
