import type { Subscription } from '../models/types';
import { ExternalLink } from 'lucide-react';
import { getLogoGradient, getLogoIcon, isImageUrl } from '../utils/logo';

interface Props {
  subscription: Subscription;
  onClick?: () => void;
}

export default function SubscriptionCard({ subscription, onClick }: Props) {
  const t = subscription.template;
  const name = subscription.name || t?.templateName || 'Custom Subscription';
  const icon = subscription.icon || t?.icon || getLogoIcon(name) || name.charAt(0);

  return (
    <div 
      onClick={onClick}
      className={`glass-panel p-5 rounded-2xl flex items-center justify-between transition-transform duration-300 group ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${getLogoGradient(name)} flex items-center justify-center text-white font-bold text-xl shadow-lg overflow-hidden`}>
          {isImageUrl(icon) ? (
            <img src={icon} alt={name} className="w-full h-full object-cover" />
          ) : (
            icon
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{name}</h3>
          {subscription.status === 'Paused' ? (
            <p className="text-sm text-amber-400 font-medium">상태: 일시정지</p>
          ) : (
            <p className="text-sm text-slate-400">다음 결제일: {new Date(subscription.nextPaymentDate).toLocaleDateString()}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xl font-bold text-slate-100">₩{subscription.selectedPrice.toLocaleString()}</p>
          <p className="text-xs text-slate-400">/ 월</p>
        </div>
        <a 
          href={t?.pageUrl || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 hidden md:block"
          title="해지 페이지로 이동"
        >
          <ExternalLink size={20} />
        </a>
      </div>
    </div>
  );
}
