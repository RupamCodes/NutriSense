import { useNavigate } from 'react-router-dom';
export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-background min-h-screen font-body-md text-on-background">
      {}
      <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/20">
        <div className="max-w-[1280px] mx-auto px-gutter flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>energy_savings_leaf</span>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">NutriSense</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors px-4 py-2">Sign In</button>
            <button onClick={() => navigate('/signup')} className="font-label-lg text-label-lg text-on-primary bg-primary hover:bg-surface-tint px-5 py-2.5 rounded-lg transition-colors shadow-sm">Get Started</button>
          </div>
        </div>
      </nav>
      {}
      <section className="pt-32 pb-20 px-gutter">
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-container/20 border border-primary-container rounded-full px-4 py-1.5 mb-6">
            <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
            <span className="font-label-lg text-label-lg text-primary">AI-Powered Nutrition Tracking</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface max-w-3xl mx-auto mb-6">
            Eat Smart.<br />Live Better.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-10">
            Track meals, build healthy habits, and get AI-powered nutrition insights — all in one beautiful app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/signup')} className="font-label-lg text-label-lg text-on-primary bg-primary hover:bg-surface-tint px-8 py-3.5 rounded-lg transition-colors shadow-sm">
              Start Free Today
            </button>
            <button className="font-label-lg text-label-lg text-primary border border-primary/30 hover:bg-primary/5 px-8 py-3.5 rounded-lg transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>
      {}
      <section className="py-20 px-gutter bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-4">Everything You Need</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant text-center mb-12 max-w-lg mx-auto">Powered by AI and backed by nutritional science</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { icon: 'restaurant', title: 'Smart Meal Logging', desc: 'Log meals with AI image recognition or search our database of 1M+ foods.' },
              { icon: 'insert_chart', title: 'Nutrition Analytics', desc: 'Track macros, micros, and trends with beautiful interactive charts.' },
              { icon: 'auto_awesome', title: 'AI Recommendations', desc: 'Get personalized meal suggestions based on your goals and preferences.' },
              { icon: 'menu_book', title: 'Meal Plans', desc: 'Generate AI-powered weekly meal plans tailored to your dietary needs.' },
              { icon: 'check_circle', title: 'Habit Tracking', desc: 'Build healthy habits with streaks, reminders, and progress tracking.' },
              { icon: 'shopping_cart', title: 'Shopping Lists', desc: 'Auto-generate shopping lists from your meal plans.' },
            ].map((f) => (
              <div key={f.title} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6 hover:shadow-[0_8px_32px_rgba(44,62,80,0.12)] hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2" style={{ fontSize: '18px' }}>{f.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section className="py-20 px-gutter">
        <div className="max-w-[1280px] mx-auto text-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Ready to Transform Your Health?</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">Join thousands of users tracking their nutrition with NutriSense.</p>
          <button onClick={() => navigate('/signup')} className="font-label-lg text-label-lg text-on-primary bg-primary hover:bg-surface-tint px-10 py-4 rounded-lg transition-colors shadow-sm">
            Get Started — It&apos;s Free
          </button>
        </div>
      </section>
      {}
      <footer className="py-8 px-gutter border-t border-outline-variant/20">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>energy_savings_leaf</span>
            <span className="font-label-lg text-label-lg text-on-surface">NutriSense</span>
          </div>
          <p className="font-label-md text-label-md text-outline">© 2026 NutriSense. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
