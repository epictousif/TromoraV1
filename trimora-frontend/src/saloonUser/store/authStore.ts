import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthStore, LoginRequest, RegisterRequest } from '../types/auth';
import { AuthService } from '../services/authService';

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: async (credentials: LoginRequest) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await AuthService.login(credentials);
            
            set({
              user: response.user,
              accessToken: response.tokens.accessToken,
              refreshToken: response.tokens.refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            
            return { success: true, data: response };
          } catch (error: any) {
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              error: error.message
            });
            return { success: false, error: error.message };
          }
        },

        register: async (userData: RegisterRequest) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await AuthService.register(userData);
            
            set({
              user: response.user,
              accessToken: response.tokens.accessToken,
              refreshToken: response.tokens.refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            
            return { success: true, data: response };
          } catch (error: any) {
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              error: error.message
            });
            return { success: false, error: error.message };
          }
        },

        logout: () => {
          AuthService.logout();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        },

        refreshAccessToken: async (): Promise<boolean> => {
          try {
            const newAccessToken = await AuthService.refreshToken();
            set({ accessToken: newAccessToken });
            return true;
          } catch (error) {
            // If refresh fails, logout user
            get().logout();
            return false;
          }
        },

        clearError: () => {
          set({ error: null });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        initializeAuth: () => {
          const isAuthenticated = AuthService.isAuthenticated();
          const storedUser = AuthService.getStoredUser();
          
          if (isAuthenticated && storedUser) {
            set({
              user: storedUser,
              accessToken: localStorage.getItem('salon_accessToken'),
              refreshToken: localStorage.getItem('salon_refreshToken'),
              isAuthenticated: true
            });
          } else {
            // Clear any stale data locally without API call
            localStorage.removeItem('salon_user');
            localStorage.removeItem('salon_accessToken');
            localStorage.removeItem('salon_refreshToken');
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            });
          }
        }
      }),
      {
        name: 'salon-auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated
        })
      }
    ),
    {
      name: 'salon-auth-store'
    }
  )
);
