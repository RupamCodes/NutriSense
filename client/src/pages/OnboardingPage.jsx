import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../stores/authStore';
const steps = [
  { title: 'Personal Info', icon: 'person' },
  { title: 'Body Metrics', icon: 'monitor_weight' },
  { title: 'Goals & Preferences', icon: 'flag' },
];
export default function OnboardingPage() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ age: '', gender: '', heightCm: '', weightKg: '', activityLevel: '', dietaryGoal: '', allergies: [], dietaryPrefs: [] });
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const handleFinish = async () => {
    try {
      await api.put('/users/onboarding', {
        ...form,
        age: parseInt(form.age) || null,
        heightCm: parseFloat(form.heightCm) || null,
        weightKg: parseFloat(form.weightKg) || null,
      });
      updateUser({ isOnboarded: true });
      toast.success('Welcome to NutriSense!');
      navigate('/dashboard');
    } catch { toast.error('Failed to save profile'); }
  };
  return (
    <div className="bg-background min-h-screen font-body-md text-on-background flex flex-col items-center justify-center p-gutter">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>energy_savings_leaf</span>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">NutriSense</h1>
        </div>
        {}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i <= step ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-lg">{s.icon}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-12 h-0.5 ${i < step ? 'bg-primary' : 'bg-outline-variant'}`} />}
            </div>
          ))}
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{steps[step].title}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">Tell us about yourself so we can personalize your experience.</p>
          {step === 0 && (
            <div className="space-y-stack-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Age</label>
                <input value={form.age} onChange={e => update('age', e.target.value)} className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none" placeholder="25" type="number" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Gender</label>
                <div className="flex gap-2 flex-wrap">
                  {['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'].map(g => (
                    <button key={g} onClick={() => update('gender', g)} className={`px-4 py-2 rounded-full font-label-lg text-label-lg transition-colors ${form.gender === g ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                      {g.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-stack-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Height (cm)</label>
                  <input value={form.heightCm} onChange={e => update('heightCm', e.target.value)} className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none" placeholder="170" type="number" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Weight (kg)</label>
                  <input value={form.weightKg} onChange={e => update('weightKg', e.target.value)} className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none" placeholder="70" type="number" />
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Activity Level</label>
                <div className="flex gap-2 flex-wrap">
                  {['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE'].map(a => (
                    <button key={a} onClick={() => update('activityLevel', a)} className={`px-4 py-2 rounded-full font-label-lg text-label-lg transition-colors ${form.activityLevel === a ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                      {a.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-stack-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Dietary Goal</label>
                <div className="flex gap-2 flex-wrap">
                  {['LOSE_WEIGHT', 'MAINTAIN_WEIGHT', 'GAIN_WEIGHT', 'BUILD_MUSCLE', 'IMPROVE_HEALTH'].map(g => (
                    <button key={g} onClick={() => update('dietaryGoal', g)} className={`px-4 py-2 rounded-full font-label-lg text-label-lg transition-colors ${form.dietaryGoal === g ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                      {g.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Allergies (comma separated)</label>
                <input value={form.allergies.join(', ')} onChange={e => update('allergies', e.target.value.split(',').map(a => a.trim()).filter(Boolean))} className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none" placeholder="nuts, dairy, gluten" />
              </div>
            </div>
          )}
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="px-6 py-2.5 border border-outline-variant rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30">
              Back
            </button>
            {step < 2 ? (
              <button onClick={() => setStep(s => s + 1)} className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-lg text-label-lg hover:bg-surface-tint transition-colors">
                Continue
              </button>
            ) : (
              <button onClick={handleFinish} className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-lg text-label-lg hover:bg-surface-tint transition-colors">
                Finish Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
