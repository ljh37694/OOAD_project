import { LayoutDashboard, List, PlusCircle, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Subscriptions', path: '/subscriptions', icon: List },
    { name: 'Add New', path: '/add', icon: PlusCircle },
  ];

  return (
    <nav className="fixed md:left-0 md:top-0 bottom-0 w-full md:w-64 md:h-screen glass-panel z-50 flex flex-row md:flex-col items-center md:items-start justify-around md:justify-start pt-2 md:pt-10 pb-2 md:pb-0 px-4 md:px-6">
      <div className="hidden md:flex items-center gap-3 mb-10 w-full px-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg">
          S
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          SMA
        </span>
      </div>

      <div className="flex md:flex-col gap-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${
                isActive 
                  ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-purple-400' : ''} />
              <span className="hidden md:block font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="hidden md:block mt-auto mb-10 w-full">
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </nav>
  );
}
