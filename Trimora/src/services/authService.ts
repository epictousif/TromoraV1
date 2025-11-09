import { apiFetch } from "../lib/api";

// Declare Google API types
declare global {
  interface Window {
    google: any;
  }
}

// Initialize Google API
export const initGoogleAuth = (onSuccess: (response: any) => void, onFailure?: (error: any) => void) => {
  if (typeof window !== 'undefined') {
    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          if (response.error) {
            onFailure?.(response.error);
          } else {
            onSuccess(response);
          }
        }
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { 
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          logo_alignment: 'left',
        }
      );
    } catch (error) {
      onFailure?.(error);
    }
  }
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  userId: string;
  message?: string;
};

export async function registerUser(input: { name: string; email: string; password: string; phoneNumber?: string; dob?: string; referralCode?: string }) {
  const res = await apiFetch(`/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as any));
    throw new Error(j.message || `Registration failed (${res.status})`);
  }
  return res.json();
}

export async function loginUser(input: { email: string; password: string }): Promise<LoginResponse> {
  const res = await apiFetch(`/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as any));
    throw new Error(j.message || `Login failed (${res.status})`);
  }
  return res.json();
}

export async function googleAuth(token: string): Promise<LoginResponse> {
  const res = await apiFetch(`/api/v1/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Google authentication failed');
  }
  
  return res.json();
}

export async function getCurrentUser() {
  const res = await apiFetch(`/user/me`);
  if (!res.ok) throw new Error("Failed to fetch current user");
  return res.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
  const res = await apiFetch(`/api/v1/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  
  if (!res.ok) {
    throw new Error('Failed to refresh access token');
  }
  
  return res.json();
}
