import { NavLink } from 'react-router-dom';
const navItems = [
  { path: '/dashboard', icon: 'home', label: 'Home', end: true },
  { path: '/log-meal', icon: 'restaurant', label: 'Log Meal' },
  { path: '/nutrition', icon: 'nutrition', label: 'My Nutrition' },
  { path: '/meal-plans', icon: 'menu_book', label: 'Meal Plans' },
  { path: '/habits', icon: 'check_circle', label: 'Habits' },
  { path: '/ai-suggestions', icon: 'insert_chart', label: 'AI Insights' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
];
export default function Sidebar() {
  return (
    <nav className="hidden md:flex flex-col bg-slate-50 dark:bg-slate-950 text-emerald-500 dark:text-emerald-400 font-sans text-[13px] font-semibold uppercase tracking-wider h-screen w-64 border-r border-slate-200 dark:border-slate-800 fixed left-0 top-0 pt-20 pb-6 px-4 z-40">
      <ul className="flex flex-col gap-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg px-4 py-3 border-l-4 border-emerald-500 cursor-pointer select-none hover:translate-x-1 transition-transform duration-200'
                  : 'flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer select-none hover:translate-x-1 transition-transform duration-200'
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
