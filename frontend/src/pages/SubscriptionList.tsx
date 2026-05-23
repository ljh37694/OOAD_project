import { useState } from "react";
import { Search, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscriptions } from "../context/SubscriptionContext";
import { useAuth } from "../context/AuthContext";
import SubscriptionDetailModal from "../components/SubscriptionDetailModal";
import type { Subscription } from "../models/types";
import { getLogoGradient, getLogoIcon, isImageUrl } from "../utils/logo";

export default function SubscriptionList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { subscriptions, availableCategories } = useSubscriptions();
  const { user } = useAuth();
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = (sub.name || sub.template?.templateName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? (sub.categories?.includes(selectedTag) || sub.category === selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            내 구독 서비스
          </h1>
          <p className="text-slate-400">
            가입 중이거나 정지된 모든 구독 서비스를 관리하세요.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="서비스 검색..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <span className="text-sm text-slate-400 mr-2">필터:</span>
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${!selectedTag ? 'bg-purple-500 text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
        >
          전체
        </button>
        {availableCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedTag(selectedTag === cat ? null : cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${selectedTag === cat ? 'bg-purple-500 text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
          >
            #{cat}
          </button>
        ))}
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 font-semibold text-slate-300">
                서비스명
              </th>
              <th className="px-6 py-4 font-semibold text-slate-300">
                카테고리
              </th>
              <th className="px-6 py-4 font-semibold text-slate-300">
                결제 주기
              </th>
              <th className="px-6 py-4 font-semibold text-slate-300">금액</th>
              <th className="px-6 py-4 font-semibold text-slate-300">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {user ? (
              filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-white/5 transition-colors group cursor-pointer"
                      onClick={() => setSelectedSub(sub)}
                    >
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        {(() => {
                          const sName = sub.name || sub.template?.templateName || "C";
                          const sIcon = sub.icon || sub.template?.icon || getLogoIcon(sName) || sName.charAt(0);
                          return (
                            <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${getLogoGradient(sName)} flex items-center justify-center text-xs font-bold shadow-md overflow-hidden`}>
                              {isImageUrl(sIcon) ? (
                                <img src={sIcon} alt="icon" className="w-full h-full object-cover" />
                              ) : (
                                sIcon
                              )}
                            </div>
                          );
                        })()}
                        {sub.name || sub.template?.templateName}
                      </td>
                    <td className="px-6 py-4 text-slate-400">
                      {sub.categories && sub.categories.length > 0 
                        ? sub.categories.map(c => `#${c}`).join(', ') 
                        : sub.category || sub.template?.category}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {(() => {
                        const rawCycle = sub.cycle || sub.template?.calender || "";
                        if (rawCycle.toLowerCase().includes("month")) {
                          return rawCycle.replace(/months?/i, "개월");
                        }
                        if (rawCycle.toLowerCase().includes("year")) {
                          return rawCycle.replace(/years?/i, "년");
                        }
                        return rawCycle;
                      })()}
                    </td>
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
                        {sub.status === "Active" ? "활성" : "일시정지"}
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
                    검색어 "{searchTerm}"에 매칭되는 구독이 없습니다.
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-slate-400 text-lg mb-6">구독 내역을 보거나 관리하려면 로그인이 필요합니다.</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-linear-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-purple-500/25"
                    >
                      <LogIn size={20} />
                      로그인 / 회원가입
                    </button>
                  </div>
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
