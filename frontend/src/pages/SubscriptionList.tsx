import { useState } from "react";
import { Search } from "lucide-react";
import { useSubscriptions } from "../context/SubscriptionContext";
import SubscriptionDetailModal from "../components/SubscriptionDetailModal";
import type { Subscription } from "../models/types";

export default function SubscriptionList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { subscriptions } = useSubscriptions();
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  const filteredSubscriptions = subscriptions.filter((sub) =>
    (sub.name || sub.template?.templateName || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            My Subscriptions
          </h1>
          <p className="text-slate-400">
            Manage all your active and inactive subscriptions.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search service..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="glass-panel rounded-3xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 font-semibold text-slate-300">
                Service
              </th>
              <th className="px-6 py-4 font-semibold text-slate-300">
                Category
              </th>
              <th className="px-6 py-4 font-semibold text-slate-300">
                Billing Cycle
              </th>
              <th className="px-6 py-4 font-semibold text-slate-300">Price</th>
              <th className="px-6 py-4 font-semibold text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredSubscriptions.length > 0 ? (
              filteredSubscriptions.map((sub, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => setSelectedSub(sub)}
                  >
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow-md overflow-hidden">
                        {(sub.icon || sub.template?.icon || "").startsWith("data:image") ? (
                          <img src={sub.icon || sub.template?.icon} alt="icon" className="w-full h-full object-cover" />
                        ) : (
                          (sub.icon || sub.template?.icon || sub.name || sub.template?.templateName || "C").charAt(0)
                        )}
                      </div>
                      {sub.name || sub.template?.templateName}
                    </td>
                  <td className="px-6 py-4 text-slate-400">
                    {sub.categories && sub.categories.length > 0 
                      ? sub.categories.map(c => `#${c}`).join(', ') 
                      : sub.category || sub.template?.category}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{sub.cycle || sub.template?.calender}</td>
                  <td className="px-6 py-4 font-semibold">
                    ₩{(sub.selectedPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-400"
                >
                  No subscriptions found matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SubscriptionDetailModal 
        subscription={selectedSub} 
        onClose={() => setSelectedSub(null)} 
      />
    </div>
  );
}
