import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
const COLORS = ['#006397', '#ff9875', '#6c7b6d'];
export default function NutritionPage() {
  const { data: weekly } = useQuery({ queryKey: ['analytics', 'weekly'], queryFn: () => api.get('/analytics/weekly').then(r => r.data) });
  const { data: macros } = useQuery({ queryKey: ['analytics', 'macros'], queryFn: () => api.get('/analytics/macros?period=7').then(r => r.data) });
  const { data: daily } = useQuery({ queryKey: ['analytics', 'daily'], queryFn: () => api.get('/analytics/daily').then(r => r.data) });
  const pieData = macros ? [
    { name: 'Protein', value: macros.protein?.grams || 0 },
    { name: 'Carbs', value: macros.carbs?.grams || 0 },
    { name: 'Fat', value: macros.fat?.grams || 0 },
  ] : [];
  return (
    <>
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">My Nutrition</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Track your nutritional trends and patterns.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {}
        <div className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Weekly Calorie Trend</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekly?.dailyData || []}>
                  <defs>
                    <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#006d37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#006d37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#bbcbbb" />
                  <XAxis dataKey="date" tick={{ fill: '#3d4a3e', fontSize: 12 }} tickFormatter={d => new Date(d).toLocaleDateString('en', { weekday: 'short' })} />
                  <YAxis tick={{ fill: '#3d4a3e', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #bbcbbb', fontFamily: 'Inter' }} />
                  <Area type="monotone" dataKey="calories" stroke="#006d37" fillOpacity={1} fill="url(#colorCal)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Macro Split (7d)</h2>
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around mt-4">
              {[{ label: 'Protein', color: 'bg-secondary', val: macros?.protein }, { label: 'Carbs', color: 'bg-tertiary-container', val: macros?.carbs }, { label: 'Fat', color: 'bg-outline', val: macros?.fat }].map(m => (
                <div key={m.label} className="text-center">
                  <div className={`w-3 h-3 rounded-full ${m.color} mx-auto mb-1`} />
                  <p className="font-label-md text-label-md text-on-surface">{m.val?.grams || 0}g</p>
                  <p className="font-label-md text-label-md text-on-surface-variant">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {}
        <div className="lg:col-span-12">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Today&apos;s Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Calories', val: `${Math.round(daily?.consumed?.calories || 0)} / ${daily?.goals?.dailyCalories || 2000}`, unit: 'kcal' },
                { label: 'Protein', val: `${Math.round(daily?.consumed?.proteinG || 0)} / ${Math.round(daily?.goals?.dailyProteinG || 50)}`, unit: 'g' },
                { label: 'Carbs', val: `${Math.round(daily?.consumed?.carbsG || 0)} / ${Math.round(daily?.goals?.dailyCarbsG || 250)}`, unit: 'g' },
                { label: 'Fat', val: `${Math.round(daily?.consumed?.fatG || 0)} / ${Math.round(daily?.goals?.dailyFatG || 65)}`, unit: 'g' },
                { label: 'Meals', val: daily?.mealCount || 0, unit: 'logged' },
              ].map(s => (
                <div key={s.label} className="text-center p-4 bg-surface-container rounded-lg">
                  <p className="font-label-md text-label-md text-on-surface-variant mb-1">{s.label}</p>
                  <p className="font-headline-md text-headline-md text-on-surface">{s.val}</p>
                  <p className="font-label-md text-label-md text-on-surface-variant">{s.unit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
