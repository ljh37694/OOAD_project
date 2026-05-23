
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Calendar, Mail, Clock } from 'lucide-react';

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <UserIcon size={48} className="mb-4 text-slate-500" />
        <h2 className="text-xl font-bold">Not Logged In</h2>
        <p className="mt-2 text-sm">Please log in to view your profile.</p>
      </div>
    );
  }

  // Format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not Provided';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-8">
        My Profile
      </h1>

      <div className="glass-panel p-8 md:p-10 rounded-[2rem] max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
            {user.picture ? (
              <img 
                src={user.picture} 
                alt={user.name} 
                className="relative w-32 h-32 rounded-full object-cover border-4 border-slate-800 shadow-xl"
              />
            ) : (
              <div className="relative w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-xl">
                <UserIcon size={64} className="text-slate-400" />
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-6 w-full">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
              <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/30">
                User Member
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-700/50">
              {/* Email */}
              <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email Address</p>
                  <p className="text-slate-200 font-medium">{user.email}</p>
                </div>
              </div>

              {/* Birthdate */}
              <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Birthdate</p>
                  <p className="text-slate-200 font-medium">{formatDate(user.birthdate)}</p>
                </div>
                {!user.birthdate && (
                  <button className="text-xs text-purple-400 hover:text-purple-300 px-3 py-1 bg-purple-500/10 rounded-full transition-colors">
                    Add
                  </button>
                )}
              </div>

              {/* Joined Date */}
              <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Member Since</p>
                  <p className="text-slate-200 font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
