import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-background min-h-screen font-body-md text-body-md text-on-background flex flex-col items-center justify-center p-gutter">
      <div className="w-full max-w-5xl bg-surface-container-lowest rounded-xl shadow-card border border-surface-container overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-10 bg-surface-container relative overflow-hidden group">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA45MSjOySVRoEgg0MUhrQCwPH_xZb2i80FSkcU6EL8Z7CJP82BfaiSv89kHXKKL2Lr9x74TrYtPG1CLBIheSqyiSZhAoTniNiuy4ZXHU6ZX3gU-t7qEA4uV48mIxikd2R2-Qs-_qHtFVwIOg_q178dJ8ffxcGCe6WPVZLNE3_ru1Tcg0ycxW7feqxzcCoC8sfJ327efvHJDPCg4xU3ojpUr84okt_paYB6_rmYJypG3pKNk2Zo9-ap6A77nwAg-yuGxOkeeDrTaApt')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/80 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>energy_savings_leaf</span>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">NutriSense</h1>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm mt-4">Your personal journey to vitality. Track meals, build habits, and feel your best every day.</p>
          </div>
          <div className="relative z-10 mt-auto">
            <div className="bg-surface-container-lowest/80 backdrop-blur-md p-6 rounded-lg border border-surface-variant/50 shadow-sm inline-block">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-10 w-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">check</span>
                </div>
                <div>
                  <p className="font-label-lg text-label-lg text-on-surface">Daily Goal Met</p>
                  <p className="font-label-md text-label-md text-on-surface-variant">Protein &amp; Greens optimized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          <div className="absolute top-8 right-8 text-right w-full">
            <p className="font-label-md text-label-md text-on-surface-variant">
              Don&apos;t have an account? <button onClick={() => navigate('/signup')} className="text-primary font-label-lg hover:underline transition-all">Sign Up</button>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
