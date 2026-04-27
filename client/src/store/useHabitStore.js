import { create } from 'zustand';
export const useHabitStore = create((set) => ({
  habits: [],
  setHabits: (habits) => set({ habits }),
  toggleCompletion: (habitId) => {
    set((state) => ({
      habits: state.habits.map(habit => 
        habit.id === habitId 
          ? { ...habit, completedToday: !habit.completedToday } 
          : habit
      )
    }));
  }
}));
