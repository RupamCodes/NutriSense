import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (credentials) => {
      },
      loginWithGoogle: async (idToken) => {
      },
      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
      refreshToken: async () => {
      },
      setUser: (user, accessToken) => {
        set({ user, accessToken, isAuthenticated: true });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);
