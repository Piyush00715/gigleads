import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { Sun, Moon, Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const location = useLocation();

  // Get Page Title from active Route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard Analytics';
      case '/leads':
        return 'Leads Management';
      case '/profile':
        return 'My Account Profile';
      default:
        if (location.pathname.startsWith('/leads/')) {
          return 'Lead Details';
        }
        return 'Smart Leads';
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200/60 dark:border-dark-800/80 bg-white dark:bg-dark-900 px-6 sticky top-0 z-30 shadow-sm dark:shadow-none">
      {/* Mobile & Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 dark:text-dark-400 hover:bg-slate-100 dark:hover:bg-dark-850 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right control section */}
      <div className="flex items-center gap-4">
        {/* Toggle Theme button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-xl border border-slate-200/60 dark:border-dark-800 text-slate-500 dark:text-dark-400 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Notifications Icon (SaaS visual anchor) */}
        <button className="hidden sm:block p-2.5 rounded-xl border border-slate-200/60 dark:border-dark-800 text-slate-500 dark:text-dark-400 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-dark-900" />
        </button>

        {/* User Quick Info */}
        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200/60 dark:border-dark-800">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
              {user?.name}
            </p>
            <span className="text-[10px] font-medium text-slate-400 dark:text-dark-400">
              {user?.role} Mode
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
