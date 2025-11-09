import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = { id?: string; name?: string; email?: string } | null;

type AuthState = {
  token: string | null;
  user: AuthUser;
  login: (payload: { token: string; user?: AuthUser }) => void;
  logout: () => void;
};

const TOKEN_KEY = "trimora_token";
const USER_KEY = "trimora_user";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: ({ token, user }) => {
        set({ token, user: user ?? null });
        try {
          localStorage.setItem(TOKEN_KEY, token);
          if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch {}
      },
      logout: () => {
        set({ token: null, user: null });
        try {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        } catch {}
      },
    }),
    {
      name: "trimora_auth", // storage name for Zustand
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
