import { create } from 'zustand';
export const useUIStore = create((set) => ({
  sidebarOpen: false,
  activeDate: new Date(),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveDate: (date) => set({ activeDate: date })
}));
