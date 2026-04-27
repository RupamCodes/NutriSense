import React from 'react';
export const MainLayout = ({ children, Sidebar, BottomNav, Topbar }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {}
      <aside className="hidden md:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-300
        md:w-20 lg:w-20 2xl:w-[280px]">
        {Sidebar}
      </aside>
      <div className="flex-1 flex flex-col h-full relative">
        {}
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-20">
          {Topbar}
        </header>
        {}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
        {}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-30 flex items-center justify-around px-2 pb-safe">
          {BottomNav}
        </nav>
      </div>
    </div>
  );
};
export const DashboardGrid = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
      {children}
    </div>
  );
};
