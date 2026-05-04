import { X } from "lucide-react";
import type { Subscription } from "../models/types";
import { useSubscriptions } from "../context/SubscriptionContext";
import { useNavigate } from "react-router-dom";

interface Props {
  subscription: Subscription | null;
  onClose: () => void;
}

export default function SubscriptionDetailModal({ subscription, onClose }: Props) {
  const { subscriptions, updateSubscription } = useSubscriptions();
  const navigate = useNavigate();

  if (!subscription) return null;

  const currentSub = subscriptions.find((s) => s.id === subscription.id) || subscription;

  const t = currentSub.template;
  const name = currentSub.name || t?.templateName || "Custom Subscription";
  const icon = t?.icon || currentSub.name?.charAt(0) || t?.templateName?.charAt(0) || "C";
  const categories = currentSub.categories && currentSub.categories.length > 0 
    ? currentSub.categories 
    : [currentSub.category || t?.category || "Uncategorized"];
  const cycle = currentSub.cycle || t?.calender || "Monthly";

  const getGradient = (n: string) => {
    if (n.toLowerCase().includes("netflix")) return "from-red-600 to-red-900";
    if (n.toLowerCase().includes("youtube")) return "from-red-500 to-rose-600";
    if (n.toLowerCase().includes("spotify")) return "from-green-500 to-emerald-700";
    return "from-slate-600 to-slate-800";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="glass-panel p-8 rounded-3xl w-full max-w-md relative shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition bg-white/5 hover:bg-white/10 p-2 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mb-8 pt-4">
          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${getGradient(name)} flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-6 overflow-hidden`}>
            {icon.startsWith("data:image") ? (
              <img src={icon} alt={name} className="w-full h-full object-cover" />
            ) : (
              icon
            )}
          </div>
          <h2 className="text-3xl font-bold mb-2">{name}</h2>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {categories.map((c, idx) => (
              <span key={idx} className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 font-medium">
                #{c}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl bg-white/5 border-none">
            <p className="text-slate-400 text-sm font-medium mb-1">Billing Details</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">₩{currentSub.selectedPrice.toLocaleString()}</span>
              <span className="text-slate-400 mb-1">/ {cycle.toLowerCase()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-center">
              <p className="text-slate-400 text-sm font-medium mb-1">Next Payment</p>
              <p className="font-semibold">{new Date(currentSub.nextPaymentDate).toLocaleDateString()}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Status</p>
                <p className={`font-semibold ${currentSub.status === "Active" ? "text-emerald-400" : "text-amber-400"}`}>
                  {currentSub.status || "Active"}
                </p>
              </div>
              <button
                onClick={() => {
                  const newStatus = currentSub.status === "Active" ? "Paused" : "Active";
                  updateSubscription(currentSub.id, { status: newStatus });
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentSub.status === "Active"
                    ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                }`}
              >
                {currentSub.status === "Active" ? "Pause" : "Activate"}
              </button>
            </div>
          </div>

          {currentSub.memo && (
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-slate-400 text-sm font-medium mb-2">Memo / Notes</p>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{currentSub.memo}</p>
            </div>
          )}

          <button
            onClick={() => {
              onClose();
              navigate(`/edit/${currentSub.id}`);
            }}
            className="block w-full py-4 text-center rounded-xl font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
          >
            Edit Subscription
          </button>
        </div>
      </div>
    </div>
  );
}
