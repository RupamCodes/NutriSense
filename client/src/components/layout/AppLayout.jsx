import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
export default function AppLayout() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      {}
      <Sidebar />
      {}
      <div className="flex-1 flex flex-col md:ml-64 w-full">
        <Navbar />
        <main className="flex-1 pt-24 pb-20 md:pb-8 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full">
          <Outlet />
        </main>
        {}
        <MobileNav />
      </div>
    </div>
  );
}
