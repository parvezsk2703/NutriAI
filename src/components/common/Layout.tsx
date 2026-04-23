import React, { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Camera, 
  PlusCircle, 
  User as UserIcon, 
  Home as HomeIcon,
  LogOut,
  Utensils,
  Brain
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { authService } from '../../services/auth.service';
import { motion } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, profile, isSigningIn } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Analyze', path: '/analyze', icon: Camera },
    { name: 'Planner', path: '/planner', icon: Utensils },
    { name: 'Insights', path: '/insights', icon: Brain },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 px-4 md:px-8 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white shadow-sm shadow-blue-200 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">NutriAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 h-full">
            {user && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors h-full flex items-center px-1 border-b-2 ${
                  location.pathname === item.path 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-200'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-6 h-10">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 leading-none">
                    {profile?.displayName || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{profile?.goal || 'Healthy'}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => authService.login()}
                disabled={isSigningIn}
                className={`bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-semibold shadow-lg transition-all ${
                  isSigningIn 
                    ? 'opacity-50 cursor-not-allowed shadow-none scale-95' 
                    : 'shadow-blue-200 hover:bg-blue-700 active:scale-95'
                }`}
              >
                {isSigningIn ? 'Signing In...' : 'Sign In'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-8 py-12 focus:outline-none min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex items-center justify-around py-4 px-6 z-40">
          <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-slate-400'}`}>
            <HomeIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
          </Link>
          <Link to="/analyze" className="relative -top-6">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-200 border-4 border-slate-50">
              <Camera className="w-7 h-7" />
            </div>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/profile' ? 'text-blue-600' : 'text-slate-400'}`}>
            <UserIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
          </Link>
        </nav>
      )}
    </div>
  );
};
