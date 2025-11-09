// Auth Types
export interface User {
  id: string; // Changed from _id to id to match API response
  name: string;
  email: string;
  phoneNumber: string;
  aadharCard: string;
  panNumber: string;
  role: 'saloonUser';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  aadharCard: string;
  panNumber: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  message: string;
}

export interface RefreshResponse {
  status: string;
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<{ success: boolean; data?: any; error?: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; data?: any; error?: string }>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;
