import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import SubscriptionCard from "../components/SubscriptionCard";
import SubscriptionDetailModal from "../components/SubscriptionDetailModal";
import { useSubscriptions } from "../context/SubscriptionContext";
import type { Subscription } from "../models/types";

export default function Dashboard() {
  const navigate = useNavigate();
  const { subscriptions } = useSubscriptions();
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  const activeSubscriptions = subscriptions.filter(s => s.status === "Active");

  const totalMonthly = activeSubscriptions.reduce(
    (acc, curr) => acc + curr.selectedPrice,
    0,
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col overflow-hidden">
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">대시보드</h1>
        <p className="text-slate-400">
          돌아오신 것을 환영합니다! 구독 서비스 지출 현황을 확인하세요.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 shrink-0">
        {/* Total Spending Card */}
        <div 
          onClick={() => navigate('/calendar')}
          className="glass-panel p-6 rounded-3xl lg:col-span-2 relative overflow-hidden group cursor-pointer hover:scale-[1.01] transition-transform"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700"></div>
          <p className="text-slate-400 font-medium mb-1">
            월 총 지출액
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400 tracking-tight">
            ₩{totalMonthly.toLocaleString()}
          </h2>
          <div className="mt-8 flex items-center gap-2 text-sm text-emerald-400">
            <span className="bg-emerald-400/10 px-2 py-1 rounded-md">
              -2.4%
            </span>
            <span className="text-slate-400">지난달 대비</span>
          </div>
        </div>

        {/* Small Stat Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center text-center">
          <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
            <RefreshCw className="text-blue-400" size={24} />
          </div>
          <h3 className="text-2xl font-bold">{activeSubscriptions.length}</h3>
          <p className="text-slate-400 text-sm">활성 구독 수</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 shrink-0">
          결제 예정 구독
        </h3>
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 min-h-0">
          {subscriptions
            .sort(
              (a, b) =>
                new Date(a.nextPaymentDate).getTime() -
                new Date(b.nextPaymentDate).getTime(),
            )
            .map((sub) => (
              <SubscriptionCard 
                key={sub.id} 
                subscription={sub} 
                onClick={() => setSelectedSub(sub)} 
              />
            ))}
        </div>
      </div>

      <SubscriptionDetailModal 
        subscription={selectedSub} 
        onClose={() => setSelectedSub(null)} 
      />
    </div>
  );
}
