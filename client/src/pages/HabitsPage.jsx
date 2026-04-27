import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../services/api';
export default function HabitsPage() {
  const queryClient = useQueryClient();
  const { data: habits, isLoading } = useQuery({ queryKey: ['habits'], queryFn: () => api.get('/habits').then(r => r.data) });
  const { data: streak } = useQuery({ queryKey: ['streak'], queryFn: () => api.get('/habits/streak').then(r => r.data) });
  const logMutation = useMutation({
    mutationFn: (habitId) => api.post(`/habits/${habitId}/log`),
    onSuccess: () => { toast.success('Habit logged!'); queryClient.invalidateQueries({ queryKey: ['habits'] }); },
  });
  return (
    <>
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Habits</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Build healthy habits and track your streaks.</p>
      </div>
      {}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6 mb-stack-lg flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
        </div>
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">{streak?.streak || 0} Day Streak!</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Keep logging your habits every day to build your streak.</p>
        </div>
      </div>
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
        ) : habits?.length ? habits.map(habit => {
          const isLogged = habit.logs && habit.logs.length > 0;
          return (
            <div key={habit.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6 hover:shadow-[0_8px_32px_rgba(44,62,80,0.12)] transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${habit.color}20`, color: habit.color }}>
                  <span className="material-symbols-outlined">{habit.icon}</span>
                </div>
                <h3 className="font-label-lg text-label-lg text-on-surface flex-1">{habit.name}</h3>
              </div>
              <button onClick={() => !isLogged && logMutation.mutate(habit.id)} disabled={isLogged} className={`w-full py-2.5 rounded-lg font-label-lg text-label-lg transition-colors ${isLogged ? 'bg-primary-container/20 text-primary cursor-default' : 'bg-primary text-on-primary hover:bg-surface-tint'}`}>
                {isLogged ? '✓ Done today' : 'Mark Complete'}
              </button>
            </div>
          );
        }) : (
          <div className="col-span-full text-center py-12">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">check_circle</span>
            <p className="font-body-md text-body-md text-on-surface-variant">No habits yet. Complete onboarding to get started.</p>
          </div>
        )}
      </div>
    </>
  );
}
