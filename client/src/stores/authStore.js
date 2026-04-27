import { create } from 'zustand';
import api from '../services/api';

const SAMPLE_USER = {
  id: 'sample-user-id',
  email: 'sample@nutrisense.com',
  fullName: 'Sample User',
  isOnboarded: true,
  healthGoal: 'Lose weight',
  activityLevel: 'Moderate',
  dietaryPreference: 'None'
};

const useAuthStore = create((set, get) => ({
  user: SAMPLE_USER,
  isAuthenticated: true,
  isLoading: false, // Set to false since we are skipping initialization
  initialize: async () => {
    // We can keep this empty or just let it be. 
    // To be safe, we'll just keep the sample user.
    set({ user: SAMPLE_USER, isAuthenticated: true, isLoading: false });
  },
  login: async (email, password) => {
    // Mock login
    set({ user: SAMPLE_USER, isAuthenticated: true });
    return SAMPLE_USER;
  },
  register: async (email, password, fullName) => {
    // Mock register
    set({ user: SAMPLE_USER, isAuthenticated: true });
    return SAMPLE_USER;
  },
  googleLogin: async (credential) => {
    // Mock google login
    set({ user: SAMPLE_USER, isAuthenticated: true });
    return SAMPLE_USER;
  },
  logout: async () => {
    // For sample user, we don't really want to logout, 
    // but we can just reset to sample user or do nothing.
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // set({ user: null, isAuthenticated: false }); // Don't actually logout
  },
  updateUser: (userData) => {
    set({ user: { ...get().user, ...userData } });
  },
}));

export default useAuthStore;

