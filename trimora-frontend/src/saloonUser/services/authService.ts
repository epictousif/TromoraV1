import api, { tokenManager } from './api';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshResponse,
  User 
} from '../types/auth';

export class AuthService {
  // Login user
  static async login(credentials: LoginRequest): Promise<{ user: User; tokens: AuthResponse }> {
    try {
      const response = await api.post<AuthResponse>('/saloonUser/login', credentials);
      
      // Store tokens
      if (response.data.accessToken && response.data.refreshToken) {
        tokenManager.setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        });
      }
      
      // Fetch user data using the new access token
      const userResponse = await api.get<User>('/saloonUser/me');
      
      // Store user data
      localStorage.setItem('salon_user', JSON.stringify(userResponse.data));
      
      return {
        user: userResponse.data,
        tokens: response.data
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Register user
  static async register(userData: RegisterRequest): Promise<{ user: User; tokens: AuthResponse }> {
    try {
      const response = await api.post<AuthResponse>('/saloonUser/register', userData);
      
      // Store tokens
      if (response.data.accessToken && response.data.refreshToken) {
        tokenManager.setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        });
      }
      
      // Fetch user data using the new access token
      const userResponse = await api.get<User>('/saloonUser/me');
      
      // Store user data
      localStorage.setItem('salon_user', JSON.stringify(userResponse.data));
      
      return {
        user: userResponse.data,
        tokens: response.data
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Refresh access token
  static async refreshToken(): Promise<string> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<RefreshResponse>('/saloonUser/refresh', {
        refreshToken
      });

      // Update access token
      localStorage.setItem('salon_accessToken', response.data.accessToken);
      
      return response.data.accessToken;
    } catch (error: any) {
      tokenManager.clearTokens();
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/saloonUser/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user data');
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await api.post('/saloonUser/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const tokens = tokenManager.getTokens();
    return !!tokens?.accessToken;
  }

  // Get stored user data
  static getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('salon_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }
}
