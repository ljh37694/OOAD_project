import { useState, useEffect } from "react";
import { Plus, Minus, CircleCheck, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSubscriptions } from "../context/SubscriptionContext";
import CategoryManageModal from "../components/CategoryManageModal";

export default function EditSubscription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subscriptions, updateSubscription, availableCategories } = useSubscriptions();
  
  const [subscription, setSubscription] = useState<any>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // States for Subscription Details
  const [price, setPrice] = useState<number>(0);
  const [billingCycle, setBillingCycle] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [memo, setMemo] = useState("");

  useEffect(() => {
    if (id) {
      const sub = subscriptions.find(s => String(s.id) === String(id));
      if (sub) {
        setSubscription(sub);
        setPrice(sub.selectedPrice || 0);
        setSelectedCategories(sub.categories || (sub.category ? [sub.category] : []));
        
        // Extract months from cycle string "1 Month", "3 Months", etc.
        const cycleMatch = sub.cycle?.match(/(\d+)/);
        if (cycleMatch) {
          setBillingCycle(parseInt(cycleMatch[1], 10));
        } else {
          setBillingCycle(1);
        }
        
        setMemo(sub.memo || "");
      } else {
        navigate("/subscriptions");
      }
    }
  }, [id, subscriptions, navigate]);

  const handleSaveSubscription = () => {
    if (!subscription) return;
    
    updateSubscription(subscription.id, {
      selectedPrice: price,
      categories: selectedCategories,
      category: selectedCategories.length > 0 ? selectedCategories[0] : "Custom",
      cycle: `${billingCycle} Month${billingCycle > 1 ? 's' : ''}`,
      memo,
    });
    
    navigate(-1); // go back
  };

  if (!subscription) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition text-slate-300">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit Subscription</h1>
          <p className="text-slate-400">Update your subscription details.</p>
        </div>
      </header>

      <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subscription.template?.color || 'from-slate-600 to-slate-800'} flex items-center justify-center text-white font-bold text-2xl shadow-lg overflow-hidden`}>
              {(subscription.icon || subscription.template?.icon || "").startsWith("data:image") ? (
                <img src={subscription.icon || subscription.template?.icon} alt={subscription.name} className="w-full h-full object-cover" />
              ) : (
                subscription.icon || subscription.template?.icon || subscription.name?.charAt(0) || "C"
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{subscription.name || subscription.template?.templateName}</h2>
              <p className="text-slate-400">{subscription.category}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Monthly Price (₩)</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPrice((p) => Math.max(0, p - 1000))} className="bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition text-slate-300">
                  <Minus size={20} />
                </button>
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₩</span>
                  <input
                    type="text"
                    value={price === 0 ? "" : price.toLocaleString()}
                    onChange={(e) => {
                      const val = e.target.value.replace(/,/g, "");
                      if (!isNaN(Number(val))) setPrice(Number(val));
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-center font-semibold text-lg"
                    placeholder="0"
                  />
                </div>
                <button type="button" onClick={() => setPrice((p) => p + 1000)} className="bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition text-slate-300">
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Categories (Hashtags)</label>
              <div className="flex flex-wrap gap-2 items-center">
                <button type="button" onClick={() => setIsCategoryModalOpen(true)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500 transition text-slate-300">
                  <Plus size={16} />
                </button>
                {availableCategories.map(cat => {
                   const isSelected = selectedCategories.includes(cat);
                   return (
                     <button
                       key={cat}
                       type="button"
                       onClick={() => {
                         if (isSelected) setSelectedCategories(prev => prev.filter(c => c !== cat));
                         else setSelectedCategories(prev => [...prev, cat]);
                       }}
                       className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${isSelected ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
                     >
                       #{cat}
                     </button>
                   );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Billing Cycle</label>
              <div className="flex gap-2">
                {[1, 3, 6, 12].map(months => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setBillingCycle(months)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${billingCycle === months ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
                  >
                    {months} {months === 1 ? 'Month' : 'Months'}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Memo / Notes (Optional)</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-y"
                placeholder="e.g. Shared with family, Cancel before trial ends..."
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={() => navigate(-1)} className="flex-1 py-3 rounded-xl font-medium bg-slate-800 text-white hover:bg-slate-700 transition">
              Cancel
            </button>
            <button onClick={handleSaveSubscription} className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition flex items-center justify-center gap-2">
              <CircleCheck size={20} />
              Save Changes
            </button>
          </div>
      </div>

      <CategoryManageModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
    </div>
  );
}
