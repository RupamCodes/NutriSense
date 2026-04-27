import { NavLink } from 'react-router-dom';
const mobileNavItems = [
  { path: '/dashboard', icon: 'home', label: 'Home', end: true },
  { path: '/log-meal', icon: 'restaurant', label: 'Log' },
  { path: '/nutrition', icon: 'nutrition', label: 'Nutrition' },
  { path: '/habits', icon: 'check_circle', label: 'Habits' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
];
export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 px-2 py-1 shadow-card">
      <ul className="flex justify-around items-center">
        {mobileNavItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`
              }
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
