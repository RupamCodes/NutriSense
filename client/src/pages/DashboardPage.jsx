import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../stores/authStore';
export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: todayData } = useQuery({
    queryKey: ['meals', 'today'],
    queryFn: () => api.get('/meals/today').then(r => r.data),
  });
  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: () => api.get('/users/goals').then(r => r.data),
  });
  const { data: streak } = useQuery({
    queryKey: ['streak'],
    queryFn: () => api.get('/habits/streak').then(r => r.data),
  });
  const consumed = todayData?.totals || { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };
  const g = goals || { dailyCalories: 2000, dailyProteinG: 120, dailyCarbsG: 250, dailyFatG: 65 };
  const remaining = Math.max(0, g.dailyCalories - consumed.calories);
  const caloriePercent = Math.min(100, (consumed.calories / g.dailyCalories) * 100);
  const dashOffset = 283 - (283 * caloriePercent / 100);
  const meals = todayData?.meals || [];
  const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
  const mealIcons = { BREAKFAST: 'bakery_dining', LUNCH: 'lunch_dining', DINNER: 'dinner_dining', SNACK: 'cookie' };
  return (
    <>
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Dashboard</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Here&apos;s your nutritional overview for today.</p>
      </div>
      {}
      <div className="bg-primary-container/20 border border-primary-container rounded-xl p-4 mb-stack-lg flex items-start gap-4">
        <div className="bg-primary-container text-on-primary-container p-2 rounded-full shrink-0">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
        </div>
        <div>
          <h3 className="font-label-lg text-label-lg text-on-surface mb-1">AI Tip of the Day</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {consumed.proteinG < g.dailyProteinG * 0.6
              ? "You're slightly low on protein. Adding a handful of almonds to your afternoon snack could help you hit your goal!"
              : "Great job on your protein intake today! Keep it up!"}
          </p>
        </div>
      </div>
      {}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 flex flex-col gap-stack-lg">
          {}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
            <div className="flex justify-between items-center mb-stack-md">
              <h2 className="font-headline-md text-headline-md text-on-surface">Daily Summary</h2>
              <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container py-1 px-3 rounded-full">Today</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-stack-lg">
              {}
              <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-surface-container-high" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8" />
                  <circle className="text-primary" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="283" strokeDashoffset={dashOffset} strokeLinecap="round" strokeWidth="8" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-display-lg text-display-lg text-on-surface">{Math.round(consumed.calories).toLocaleString()}</span>
                  <span className="font-label-md text-label-md text-on-surface-variant">/ {g.dailyCalories.toLocaleString()} kcal</span>
                  <span className="font-label-md text-label-md text-primary mt-1">{remaining} remaining</span>
                </div>
              </div>
              {}
              <div className="flex-1 w-full flex flex-col gap-stack-md">
                {[
                  { label: 'Protein', current: consumed.proteinG, target: g.dailyProteinG, color: 'bg-secondary' },
                  { label: 'Carbs', current: consumed.carbsG, target: g.dailyCarbsG, color: 'bg-tertiary-container' },
                  { label: 'Fat', current: consumed.fatG, target: g.dailyFatG, color: 'bg-outline' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between mb-1">
                      <span className="font-label-md text-label-md text-on-surface-variant">{m.label}</span>
                      <span className="font-label-md text-label-md text-on-surface">{Math.round(m.current)}g / {Math.round(m.target)}g</span>
                    </div>
                    <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                      <div className={`h-full ${m.color} rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Today&apos;s Meals</h2>
            <div className="flex flex-col gap-4">
              {mealTypes.map(type => {
                const meal = meals.find(m => m.mealType === type);
                return (
                  <div key={type} className={`border border-outline-variant rounded-lg p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors ${!meal ? 'border-dashed' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center ${meal ? 'text-primary' : 'text-outline'}`}>
                        <span className="material-symbols-outlined">{mealIcons[type]}</span>
                      </div>
                      <div>
                        <h4 className="font-label-lg text-label-lg text-on-surface">{type.charAt(0) + type.slice(1).toLowerCase()}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                          {meal ? `${meal.name} • ${Math.round(meal.totalCalories)} kcal` : `Log your ${type.toLowerCase()}`}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => navigate('/log-meal')} className={meal ? 'w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors' : 'bg-primary text-on-primary px-3 py-1.5 rounded-lg font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors'}>
                      {meal ? <span className="material-symbols-outlined text-sm">add</span> : '+ Add'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {}
        <div className="lg:col-span-4 flex flex-col gap-stack-lg">
          {}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
            <div className="flex justify-between items-center mb-stack-md">
              <h2 className="font-headline-md text-headline-md text-on-surface">Water</h2>
              <span className="font-label-md text-label-md text-secondary">4 / 8 glasses</span>
            </div>
            <div className="flex justify-between gap-2">
              {[1,2,3,4,5,6,7,8].map(i => (
                <button key={i} className={i <= 4
                  ? 'w-10 h-10 rounded-full bg-secondary text-on-primary flex items-center justify-center hover:scale-105 transition-transform'
                  : 'w-10 h-10 rounded-full bg-surface-container border border-outline-variant text-outline flex items-center justify-center hover:bg-secondary-container hover:text-on-secondary-container transition-colors'}>
                  <span className="material-symbols-outlined text-sm" style={i <= 4 ? { fontVariationSettings: "'FILL' 1" } : {}}>water_drop</span>
                </button>
              ))}
            </div>
          </div>
          {}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
            <div className="flex items-center gap-4 mb-stack-md">
              <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">{streak?.streak || 0} Day Streak!</h2>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Keep it up, you&apos;re doing great.</p>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[20,40,60,80,100,100,100].map((o, i) => (
                <div key={i} className={`aspect-square bg-primary rounded-sm ${i === 6 ? 'border-2 border-outline' : ''}`} style={{ opacity: o / 100 }}></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 font-label-md text-label-md text-on-surface-variant text-xs">
              {['M','T','W','T','F','S','S'].map((d, i) => <span key={i}>{d}</span>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
