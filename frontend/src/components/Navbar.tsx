import { LayoutDashboard, List, PlusCircle, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: '대시보드', path: '/', icon: LayoutDashboard },
    { name: '구독 관리', path: '/subscriptions', icon: List },
    { name: '구독 추가', path: user ? '/add' : '/login', icon: PlusCircle },
  ];

  return (
    <nav className="fixed md:left-0 md:top-0 bottom-0 w-full md:w-64 md:h-screen glass-panel z-50 flex flex-row md:flex-col items-center md:items-start justify-around md:justify-start pt-2 md:pt-10 pb-2 md:pb-0 px-4 md:px-6">
      <div className="hidden md:flex flex-col mb-10 w-full px-2 gap-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg">
            S
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400">
            SMA
          </span>
        </div>

        {/* User Profile Section */}
        {user ? (
          <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/10">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-700 group-hover:border-purple-400 transition-colors" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-purple-400 transition-colors">
                <UserIcon size={20} className="text-slate-400" />
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">{user.name}</span>
              <span className="text-xs text-slate-500 truncate">프로필 보기</span>
            </div>
          </Link>
        ) : (
          <Link to="/login" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/10">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-purple-400 transition-colors">
              <UserIcon size={20} className="text-slate-500" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-slate-400 truncate group-hover:text-white transition-colors">로그인이 필요합니다</span>
              <span className="text-xs text-slate-500 truncate">로그인하려면 클릭</span>
            </div>
          </Link>
        )}
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
        {user ? (
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
          >
            <LogOut size={20} />
            <span className="font-medium">로그아웃</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
          >
            <UserIcon size={20} />
            <span className="font-medium">로그인</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
