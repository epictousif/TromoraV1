import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { tokenManager } from './api';

// API Base URL for employee service routes
const EMPLOYEE_SERVICES_API_BASE_URL = 'http://localhost:5000/api/v1/employee-service/';

const employeeServicesApi: AxiosInstance = axios.create({
  baseURL: EMPLOYEE_SERVICES_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
});

employeeServicesApi.interceptors.request.use(
  (config) => {
    const tokens = tokenManager.getTokens();
    if (tokens?.accessToken) {
      (config.headers as any).Authorization = `Bearer ${tokens.accessToken}`;
    }
    // Cache-bust GET requests to avoid stale reads after write
    const method = (config.method || 'get').toLowerCase();
    if (method === 'get') {
      const ts = Date.now().toString();
      config.params = { ...(config.params || {}), _ts: ts };
      (config.headers as any)['Cache-Control'] = 'no-store';
      (config.headers as any)['Pragma'] = 'no-cache';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

employeeServicesApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const tokens = tokenManager.getTokens();
        if (tokens?.refreshToken) {
          const refreshResponse = await axios.post('http://localhost:5000/api/v1/saloonUser/refresh', {
            refreshToken: tokens.refreshToken,
          });
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem('salon_accessToken', newAccessToken);
          (originalRequest.headers as any).Authorization = `Bearer ${newAccessToken}`;
          return employeeServicesApi(originalRequest);
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

export default employeeServicesApi;
