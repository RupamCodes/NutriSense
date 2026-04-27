import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  return (
    <header className="bg-white dark:bg-slate-900 text-emerald-500 dark:text-emerald-400 font-sans text-sm font-medium antialiased fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 shadow-card border-b border-slate-100 dark:border-slate-800 md:w-[calc(100%-16rem)] md:left-64">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-500 hover:text-emerald-500 active:scale-[0.98] transition-transform">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
          NutriSense
        </div>
      </div>
      {}
      <div className="hidden sm:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-700 dark:text-slate-300"
            placeholder="Search foods..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-emerald-500 active:scale-[0.98] relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        {}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 active:scale-[0.98] transition-transform bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm"
          >
            {user?.avatarUrl ? (
              <img alt="Profile" className="w-full h-full object-cover" src={user.avatarUrl} />
            ) : (
              user?.fullName?.charAt(0)?.toUpperCase() || 'U'
            )}
          </button>
          {showMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-xl shadow-card border border-outline-variant p-2 w-48 z-50">
              <p className="px-3 py-2 font-label-lg text-label-lg text-on-surface truncate">{user?.fullName}</p>
              <p className="px-3 pb-2 font-label-md text-label-md text-on-surface-variant truncate">{user?.email}</p>
              <hr className="border-outline-variant my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-error hover:bg-error-container rounded-lg transition-colors font-label-lg text-label-lg"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
