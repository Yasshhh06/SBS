import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LayoutDashboard, CalendarDays, LogOut, Sun, Moon, Scissors } from 'lucide-react';

const DashboardLayout = () => {
  const { logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Appointments', path: '/appointments', icon: CalendarDays },
  ];

  return (
    <div className="flex h-screen bg-salon-pink dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass shadow-xl m-4 rounded-3xl flex flex-col z-20">
        <div className="p-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-salon-primary p-2 rounded-xl">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-bold text-lg dark:text-white">Admin Panel</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-salon-primary text-white shadow-md shadow-pink-500/30' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-20 glass m-4 mb-0 rounded-3xl flex items-center justify-between px-8 z-10">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white capitalize">
            {location.pathname === '/' ? 'Overview' : location.pathname.substring(1)}
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-600" />}
            </button>
            <div className="w-10 h-10 rounded-full bg-salon-primary flex items-center justify-center text-white font-bold shadow-md">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-4 pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
