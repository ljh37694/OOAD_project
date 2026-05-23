import { useState } from "react";
import { X, Calendar as CalendarIcon, RefreshCw, AlertTriangle } from "lucide-react";
import type { Subscription } from "../models/types";
import { useSubscriptions } from "../context/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { getLogoGradient, getLogoIcon, isImageUrl } from "../utils/logo";

interface Props {
  subscription: Subscription | null;
  onClose: () => void;
}

export default function SubscriptionDetailModal({ subscription, onClose }: Props) {
  const { subscriptions, updateSubscription } = useSubscriptions();
  const navigate = useNavigate();

  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [showActivateForm, setShowActivateForm] = useState(false);
  const [activateStartDate, setActivateStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [activateCycle, setActivateCycle] = useState(1);

  if (!subscription) return null;

  const currentSub = subscriptions.find((s) => s.id === subscription.id) || subscription;

  const t = currentSub.template;
  const name = currentSub.name || t?.templateName || "Custom Subscription";
  const icon = currentSub.icon || t?.icon || getLogoIcon(name) || name.charAt(0);
  const categories = currentSub.categories && currentSub.categories.length > 0 
    ? currentSub.categories 
    : [currentSub.category || t?.category || "Uncategorized"];
  const cycle = currentSub.cycle || t?.calender || "Monthly";


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="glass-panel p-8 rounded-3xl w-full max-w-md relative shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setShowPauseConfirm(false);
            setShowActivateForm(false);
            onClose();
          }}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition bg-white/5 hover:bg-white/10 w-9 h-9 flex items-center justify-center rounded-full z-10"
        >
          <X size={20} />
        </button>

        {showPauseConfirm ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-4">정말로 멈추시겠습니까?</h2>
            <p className="text-slate-400 mb-8">구독을 일시 정지하면 예정된 결제 내역이 캘린더에서 표시되지 않습니다.</p>
            <div className="flex w-full gap-4">
              <button 
                onClick={() => setShowPauseConfirm(false)}
                className="flex-1 py-3 rounded-xl font-medium bg-slate-800 text-white hover:bg-slate-700 transition"
              >
                취소
              </button>
              <button 
                onClick={() => {
                  if (currentSub.id) {
                    updateSubscription(currentSub.id, { status: "Paused" });
                  }
                  setShowPauseConfirm(false);
                }}
                className="flex-1 py-3 rounded-xl font-medium bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition"
              >
                일시 정지
              </button>
            </div>
          </div>
        ) : showActivateForm ? (
          <div className="flex flex-col py-6">
            <h2 className="text-2xl font-bold mb-2">구독 활성화</h2>
            <p className="text-slate-400 mb-8">새로운 시작일과 결제 주기를 설정해주세요.</p>
            
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  <CalendarIcon size={16} className="inline mr-2" />
                  구독 시작 날짜
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={activateStartDate}
                  onChange={(e) => setActivateStartDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [color-scheme:dark]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  <RefreshCw size={16} className="inline mr-2" />
                  결제 사이클
                </label>
                <div className="flex gap-2">
                  {[1, 3, 6, 12].map(months => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setActivateCycle(months)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${activateCycle === months ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
                    >
                      {months} {months === 1 ? '개월' : '개월'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex w-full gap-4">
              <button 
                onClick={() => setShowActivateForm(false)}
                className="flex-1 py-3 rounded-xl font-medium bg-slate-800 text-white hover:bg-slate-700 transition"
              >
                취소
              </button>
              <button 
                onClick={() => {
                  if (currentSub.id) {
                    const d = new Date(activateStartDate);
                    d.setMonth(d.getMonth() + activateCycle);
                    updateSubscription(currentSub.id, { 
                      status: "Active",
                      cycle: `${activateCycle} 개월`,
                      nextPaymentDate: d.toISOString()
                    });
                  }
                  setShowActivateForm(false);
                }}
                className="flex-1 py-3 rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-400 transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                활성화
              </button>
            </div>
          </div>
        ) : (
          <>

        <div className="flex flex-col items-center text-center mb-8 pt-4">
          <div className={`w-24 h-24 rounded-3xl bg-linear-to-br ${getLogoGradient(name)} flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-6 overflow-hidden`}>
            {isImageUrl(icon) ? (
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
            <p className="text-slate-400 text-sm font-medium mb-1">결제 상세 정보</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">₩{currentSub.selectedPrice.toLocaleString()}</span>
              <span className="text-slate-400 mb-1">/ {cycle.toLowerCase().includes('month') ? '월' : cycle.toLowerCase().includes('year') ? '년' : cycle}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-center">
              <p className="text-slate-400 text-sm font-medium mb-1">다음 결제일</p>
              <p className="font-semibold">{new Date(currentSub.nextPaymentDate).toLocaleDateString()}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">상태</p>
                <p className={`font-semibold ${currentSub.status === "Active" ? "text-emerald-400" : "text-amber-400"}`}>
                  {currentSub.status === "Active" ? "활성" : "일시정지"}
                </p>
              </div>
              <button
                onClick={() => {
                  if (currentSub.status === "Active") {
                    setShowPauseConfirm(true);
                  } else {
                    setShowActivateForm(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentSub.status === "Active"
                    ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                }`}
              >
                {currentSub.status === "Active" ? "정지" : "활성"}
              </button>
            </div>
          </div>

          {currentSub.memo && (
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-slate-400 text-sm font-medium mb-2">메모 / 노트</p>
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
            구독 정보 수정
          </button>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
