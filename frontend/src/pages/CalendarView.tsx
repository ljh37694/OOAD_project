import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { fetchApi } from "../utils/api";
import { useSubscriptions } from "../context/SubscriptionContext";

interface PaymentHistory {
  id: number;
  subscriptionName: string;
  price: number;
  icon: string;
  color: string;
  paymentDate: string;
  status: string;
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

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
          color: 'from-slate-600 to-slate-800',
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
  const activeDbPayments = dbPayments.filter(dp => {
    if (dp.status !== "SCHEDULED") return true; // Keep past paid payments
    const sub = subscriptions.find(s => s.name === dp.subscriptionName);
    return sub ? sub.status === "Active" : true;
  });

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl mx-auto pb-20">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-1 flex items-center gap-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              ₩{monthTotal.toLocaleString()}
            </span>
          </h1>
          <p className="text-slate-400 font-medium">
            {isPastMonth ? "Total Paid in" : "Scheduled for"} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </p>
        </div>
      </header>

      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-8">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition text-slate-300">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition text-slate-300">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {days.map(day => (
            <div key={day} className="text-center font-semibold text-slate-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-slate-400">Loading calendar...</div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px] p-2 rounded-xl bg-white/5 opacity-50"></div>
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayPayments = getPaymentsForDate(day);
              const dayTotal = dayPayments.reduce((acc, curr) => acc + curr.price, 0);
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
                  className={`min-h-[80px] p-2 rounded-xl border flex flex-col transition-colors ${
                    isToday ? 'bg-purple-900/20 border-purple-500/50' : 'bg-white/5 border-white/5'
                  } ${dayPayments.length > 0 ? 'cursor-pointer hover:bg-white/10' : ''}`}
                >
                  <div className="flex justify-between items-start mb-auto">
                    <span className={`text-sm font-medium ${isToday ? 'text-purple-400 font-bold' : 'text-slate-400'} ${dayPayments.length > 0 ? 'text-slate-200' : ''}`}>
                      {day}
                    </span>
                  </div>
                  
                  {dayPayments.length > 0 && (
                    <div className="mt-1 flex flex-col gap-0.5">
                      {dayPayments.map((payment, idx) => (
                        <div key={`${payment.id}-${idx}`} className="text-[10px] sm:text-xs font-semibold text-right text-slate-300 truncate" title={payment.subscriptionName}>
                          ₩{payment.price.toLocaleString()}
                        </div>
                      ))}
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
                    <div className={`w-10 h-10 rounded-lg flex-shrink-0 bg-gradient-to-br ${p.color || 'from-slate-600 to-slate-800'} flex items-center justify-center overflow-hidden`}>
                      {(p.icon || "").startsWith('data:image') ? (
                        <img src={p.icon} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm text-white font-bold">{p.icon || p.subscriptionName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">{p.subscriptionName}</p>
                      <p className={`text-xs font-medium ${p.status === 'PAID' ? 'text-emerald-400' : 'text-slate-400'}`}>{p.status}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-100">₩{p.price.toLocaleString()}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-lg font-bold">
                <span className="text-slate-400">Total</span>
                <span className="text-purple-400">₩{selectedDatePayments.payments.reduce((a, b) => a + b.price, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
