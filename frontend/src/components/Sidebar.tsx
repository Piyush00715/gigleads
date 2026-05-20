import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  LogOut, 
  Shield 
} from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      toast.success('Logged out successfully');
    } catch (err: any) {
      toast.error(err.message || 'Logout failed');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200/60 dark:border-dark-800/80 bg-white dark:bg-dark-900 px-4 py-6">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 shadow-md text-white font-bold text-base">
          S
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none">Smart Leads</h1>
          <span className="text-[10px] font-medium text-slate-400 dark:text-dark-400 uppercase tracking-wider">Dashboard v1.0</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 dark:text-dark-400 hover:bg-slate-100 dark:hover:bg-dark-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="border-t border-slate-200/60 dark:border-dark-800/80 pt-4 mt-auto">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-semibold text-sm">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {user?.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              {user?.role === 'Admin' && <Shield className="h-3 w-3 text-violet-500" />}
              <span className="text-[10px] text-slate-500 dark:text-dark-400 font-medium">
                {user?.role} Rep
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
