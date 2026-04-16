import type { Subscription } from '../models/types';
import { ExternalLink } from 'lucide-react';

interface Props {
  subscription: Subscription;
}

export default function SubscriptionCard({ subscription }: Props) {
  const t = subscription.template;
  
  // Example dummy logo colors based on category/name
  const getGradient = (name: string) => {
    if (name.toLowerCase().includes('netflix')) return 'from-red-600 to-red-900';
    if (name.toLowerCase().includes('youtube')) return 'from-red-500 to-rose-600';
    if (name.toLowerCase().includes('spotify')) return 'from-green-500 to-emerald-700';
    return 'from-slate-600 to-slate-800';
  };

  return (
    <div className="glass-panel p-5 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform duration-300 group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient(t?.templateName || 'Custom')} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
          {t?.templateName.charAt(0) || 'C'}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{t?.templateName || 'Custom Subscription'}</h3>
          <p className="text-sm text-slate-400">Next payment: {new Date(subscription.nextPaymentDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xl font-bold text-slate-100">₩{subscription.selectedPrice.toLocaleString()}</p>
          <p className="text-xs text-slate-400">/ month</p>
        </div>
        <a 
          href={t?.pageUrl || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 hidden md:block"
          title="Go to Cancellation Page"
        >
          <ExternalLink size={20} />
        </a>
      </div>
    </div>
  );
}
