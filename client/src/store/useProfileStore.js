import { create } from 'zustand';
export const useProfileStore = create((set) => ({
  profile: null,
  isOnboarded: false,
  fetchProfile: async () => {
  },
  updateProfile: (data) => {
    set((state) => ({ profile: { ...state.profile, ...data } }));
  },
  setOnboarded: () => {
    set({ isOnboarded: true });
  }
}));
