import { create } from 'zustand';
export const useMealStore = create((set) => ({
  todayLogs: [],
  optimisticIds: [],
  addLog: (log) => {
    set((state) => ({
      todayLogs: [...state.todayLogs, log],
      optimisticIds: [...state.optimisticIds, log.id]
    }));
  },
  removeLog: (id) => {
    set((state) => ({
      todayLogs: state.todayLogs.filter(log => log.id !== id),
      optimisticIds: state.optimisticIds.filter(optId => optId !== id)
    }));
  }
}));
