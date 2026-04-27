import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../stores/authStore';
export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { data: goals } = useQuery({ queryKey: ['goals'], queryFn: () => api.get('/users/goals').then(r => r.data) });
  const [form, setForm] = useState({});
  const goalsMutation = useMutation({
    mutationFn: (data) => api.put('/users/goals', data),
    onSuccess: () => toast.success('Goals updated!'),
  });
  return (
    <>
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Settings</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage your profile and preferences.</p>
      </div>
      <div className="max-w-2xl space-y-stack-lg">
        {}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Profile</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-2xl font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-label-lg text-label-lg text-on-surface">{user?.fullName}</p>
              <p className="font-label-md text-label-md text-on-surface-variant">{user?.email}</p>
            </div>
          </div>
        </div>
        {}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Nutrition Goals</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { key: 'dailyCalories', label: 'Daily Calories', unit: 'kcal' },
              { key: 'dailyProteinG', label: 'Protein', unit: 'g' },
              { key: 'dailyCarbsG', label: 'Carbs', unit: 'g' },
              { key: 'dailyFatG', label: 'Fat', unit: 'g' },
            ].map(f => (
              <div key={f.key}>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">{f.label} ({f.unit})</label>
                <input
                  type="number"
                  defaultValue={goals?.[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            ))}
          </div>
          <button onClick={() => goalsMutation.mutate(form)} className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-lg text-label-lg hover:bg-surface-tint transition-colors">
            Save Goals
          </button>
        </div>
        {}
        <div className="bg-surface-container-lowest rounded-xl border border-error/20 shadow-card p-6">
          <h2 className="font-headline-md text-headline-md text-error mb-2">Danger Zone</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">Once you delete your account, there is no going back.</p>
          <button onClick={() => logout()} className="px-6 py-2.5 border border-error text-error rounded-lg font-label-lg text-label-lg hover:bg-error-container transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
}
