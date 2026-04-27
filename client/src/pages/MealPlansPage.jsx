import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../services/api';
export default function MealPlansPage() {
  const queryClient = useQueryClient();
  const { data: plans, isLoading } = useQuery({ queryKey: ['meal-plans'], queryFn: () => api.get('/meal-plans').then(r => r.data) });
  const generateMutation = useMutation({
    mutationFn: () => api.post('/meal-plans/generate'),
    onSuccess: () => { toast.success('AI meal plan generated!'); queryClient.invalidateQueries({ queryKey: ['meal-plans'] }); },
    onError: () => toast.error('Failed to generate plan'),
  });
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return (
    <>
      <div className="mb-stack-lg flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Meal Plans</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Plan your meals for the week ahead.</p>
        </div>
        <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-lg text-label-lg hover:bg-surface-tint transition-colors disabled:opacity-50">
          <span className="material-symbols-outlined text-lg">auto_awesome</span>
          {generateMutation.isPending ? 'Generating...' : 'Generate AI Plan'}
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : plans?.length ? (
        <div className="space-y-stack-lg">
          {plans.map(plan => (
            <div key={plan.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
              <div className="flex justify-between items-center mb-stack-md">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                    {plan.title}
                    {plan.isAiGenerated && <span className="font-label-md text-label-md text-primary bg-primary-container/20 px-2 py-0.5 rounded-full">AI</span>}
                  </h2>
                  <p className="font-label-md text-label-md text-on-surface-variant">{new Date(plan.startDate).toLocaleDateString()} — {new Date(plan.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {days.map((day, i) => {
                  const entries = plan.entries?.filter(e => e.dayOfWeek === i) || [];
                  return (
                    <div key={day} className="bg-surface-container rounded-lg p-3">
                      <p className="font-label-lg text-label-lg text-on-surface mb-2">{day.slice(0, 3)}</p>
                      {entries.length ? entries.map(e => (
                        <div key={e.id} className="mb-2 last:mb-0">
                          <p className="font-label-md text-label-md text-on-surface">{e.title}</p>
                          <p className="font-label-md text-label-md text-on-surface-variant">{Math.round(e.calories || 0)} kcal</p>
                        </div>
                      )) : <p className="font-label-md text-label-md text-outline">No meals</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">menu_book</span>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">No Meal Plans Yet</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Generate your first AI-powered meal plan or create one manually.</p>
          <button onClick={() => generateMutation.mutate()} className="px-6 py-3 bg-primary text-on-primary rounded-lg font-label-lg text-label-lg hover:bg-surface-tint transition-colors">Generate AI Plan</button>
        </div>
      )}
    </>
  );
}
