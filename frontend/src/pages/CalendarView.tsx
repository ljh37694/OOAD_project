import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { fetchApi } from "../utils/api";
import { useSubscriptions } from "../context/SubscriptionContext";
import { getLogoGradient, getLogoIcon, isImageUrl } from "../utils/logo";

interface PaymentHistory {
  id: number;
  subscriptionName: string;
  price: number;
  icon: string;
  paymentDate: string;
  status?: string;
}

export default function CalendarView() {
  const { subscriptions } = useSubscriptions();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dbPayments, setDbPayments] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDatePayments, setSelectedDatePayments] = useState<{date: string, payments: PaymentHistory[]} | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await fetchApi('/api/payments');
        if (response.ok) {
          const data = await response.json();
          setDbPayments(data || []);
        }
      } catch (err) {
        console.error("Failed to load payment history", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPayments();
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  const isPastMonth = currentDate.getFullYear() < new Date().getFullYear() || 
                      (currentDate.getFullYear() === new Date().getFullYear() && currentDate.getMonth() < new Date().getMonth());

  // Generate virtual future payments based on active subscriptions
  const virtualPayments: PaymentHistory[] = [];
  
  subscriptions.filter(s => s.status === "Active").forEach(sub => {
    if (!sub.nextPaymentDate) return;
    const nextDate = new Date(sub.nextPaymentDate);
    if (isNaN(nextDate.getTime())) return;
    
    let cycleMonths = 1;
    if (sub.cycle?.toLowerCase() === 'yearly') cycleMonths = 12;
    else if (sub.cycle?.includes('Month')) {
      const match = sub.cycle.match(/\d+/);
      if (match) cycleMonths = parseInt(match[0], 10);
    }
    
    const targetY = currentDate.getFullYear();
    const targetM = currentDate.getMonth();
    
    let currY = nextDate.getFullYear();
    let currM = nextDate.getMonth();
    const day = nextDate.getDate();
    
    let iterations = 0;
    while ((currY < targetY || (currY === targetY && currM <= targetM)) && iterations < 60) {
      if (currY === targetY && currM === targetM) {
        virtualPayments.push({
          id: Math.random(),
          subscriptionName: sub.name || "Custom Subscription",
          price: sub.selectedPrice,
          icon: sub.icon || sub.name?.charAt(0) || "C",
          paymentDate: `${currY}-${String(currM + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          status: 'SCHEDULED'
        });
        break;
      }
      currM += cycleMonths;
      while (currM > 11) {
        currM -= 12;
        currY++;
      }
      iterations++;
    }
  });

  // Combine DB payments and virtual payments, deduplicating
  const activeDbPayments = dbPayments;

  const payments = [...activeDbPayments];
  virtualPayments.forEach(vp => {
    const existsInDb = activeDbPayments.some(dp => dp.subscriptionName === vp.subscriptionName && dp.paymentDate === vp.paymentDate);
    if (!existsInDb) {
      payments.push(vp);
    }
  });

  const getPaymentsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return payments.filter(p => p.paymentDate === dateStr);
  };

  const monthPayments = payments.filter(p => {
    const [y, m] = p.paymentDate.split('-');
    return parseInt(y) === currentDate.getFullYear() && parseInt(m) === currentDate.getMonth() + 1;
  });

  const monthTotal = monthPayments.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-xl mx-auto pb-4">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-0.5 flex items-center gap-3">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400">
              ₩{monthTotal.toLocaleString()}
            </span>
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            {isPastMonth ? "지출 완료 금액" : "결제 예정 금액"} ({monthNames[currentDate.getMonth()]} {currentDate.getFullYear()})
          </p>
        </div>
      </header>

      <div className="glass-panel p-4 md:p-5 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1.5 hover:bg-white/10 rounded-full transition text-slate-300">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-white text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={nextMonth} className="p-1.5 hover:bg-white/10 rounded-full transition text-slate-300">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {days.map((day, idx) => {
            let colorClass = "text-slate-400";
            if (idx === 0) colorClass = "text-red-500";
            else if (idx === 6) colorClass = "text-blue-400";
            return (
              <div key={day} className={`text-center text-xs font-semibold ${colorClass} py-1`}>
                {day}
              </div>
            );
          })}
        </div>

        {isLoading ? (
          <div className="h-48 flex items-center justify-center text-slate-400">캘린더 로딩 중...</div>
        ) : (
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[50px] md:min-h-[60px] p-1.5 rounded-xl bg-white/5 opacity-50"></div>
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayPayments = getPaymentsForDate(day);
              const isToday = day === new Date().getDate() && 
                              currentDate.getMonth() === new Date().getMonth() && 
                              currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div 
                  key={day} 
                  onClick={() => {
                    if (dayPayments.length > 0) {
                      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      setSelectedDatePayments({ date: dateStr, payments: dayPayments });
                    }
                  }}
                  className={`min-h-[50px] md:min-h-[60px] p-1 md:p-1.5 rounded-xl border flex flex-col transition-colors ${
                    isToday ? 'bg-purple-900/20 border-purple-500/50' : 'bg-white/5 border-white/5'
                  } ${dayPayments.length > 0 ? 'cursor-pointer hover:bg-white/10' : ''}`}
                >
                  <div className="flex justify-between items-start mb-auto">
                    <span className={(() => {
                      if (isToday) return 'text-purple-400 font-bold';
                      const dayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay();
                      if (dayOfWeek === 0) return 'text-red-500 font-medium';
                      if (dayOfWeek === 6) return 'text-blue-400 font-medium';
                      return dayPayments.length > 0 ? 'text-slate-200' : 'text-slate-400';
                    })()}>
                      {day}
                    </span>
                  </div>
                  
                  {dayPayments.length > 0 && (
                    <div className="mt-auto text-right w-full overflow-visible">
                      <div className="text-[8px] sm:text-[9px] md:text-xs font-bold text-slate-300 tracking-tighter whitespace-nowrap overflow-visible">
                        ₩{dayPayments.reduce((acc, p) => acc + p.price, 0).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedDatePayments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setSelectedDatePayments(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CalendarIcon size={24} className="text-purple-400" />
              {selectedDatePayments.date}
            </h3>
            <div className="flex flex-col gap-3">
              {selectedDatePayments.payments.map((p, idx) => (
                <div key={`${p.id}-${idx}`} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex-shrink-0 bg-linear-to-br ${getLogoGradient(p.subscriptionName)} flex items-center justify-center overflow-hidden`}>
                     {(() => {
                       const iconVal = p.icon || getLogoIcon(p.subscriptionName) || p.subscriptionName.charAt(0);
                       return isImageUrl(iconVal) ? (
                         <img src={iconVal} alt="" className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-sm text-white font-bold">{iconVal}</span>
                       );
                     })()}
                    </div>
                     <div>
                       <p className="font-semibold text-slate-200">{p.subscriptionName}</p>
                        <p className={`text-xs font-medium ${p.status === 'SCHEDULED' ? 'text-slate-400' : 'text-emerald-400'}`}>
                          {p.status === 'SCHEDULED' ? '결제예정' : '결제완료'}
                        </p>
                     </div>
                  </div>
                  <span className="font-bold text-slate-100">₩{p.price.toLocaleString()}</span>
                </div>
              ))}
               <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-lg font-bold">
                <span className="text-slate-400">합계</span>
                <span className="text-purple-400">₩{selectedDatePayments.payments.reduce((a, b) => a + b.price, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
