import { useState, useEffect } from "react";
import { Plus, Search, CircleCheck, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscriptions } from "../context/SubscriptionContext";
import CategoryManageModal from "../components/CategoryManageModal";

export default function AddSubscription() {
  const navigate = useNavigate();
  const { subscriptions, addSubscription, templates, addTemplate, availableCategories } = useSubscriptions();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // States for New Custom Service
  const [customIcon, setCustomIcon] = useState("");
  const [customName, setCustomName] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  // States for Subscription Details
  const [price, setPrice] = useState<number>(0);
  const [billingCycle, setBillingCycle] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [memo, setMemo] = useState("");

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    if (selectedTemplate) {
      setPrice(selectedTemplate.price || 0);
      const cat = selectedTemplate.category;
      if (cat) {
        setSelectedCategories([cat]);
      } else {
        setSelectedCategories([]);
      }
      setBillingCycle(1);
    }
  }, [selectedTemplate]);

  const handleSaveSubscription = () => {
    if (!selectedTemplate) return;
    
    addSubscription({
      id: Math.random().toString(),
      template: {
        templateName: selectedTemplate.name,
        category: selectedTemplate.category,
        calender: "Monthly",
        price: selectedTemplate.price,
        pageUrl: selectedTemplate.pageUrl || ""
      },
      name: selectedTemplate.name,
      icon: selectedTemplate.icon,
      category: selectedCategories.length > 0 ? selectedCategories[0] : "Custom", // backward compatibility
      categories: selectedCategories,
      cycle: `${billingCycle} Month${billingCycle > 1 ? 's' : ''}`,
      selectedPrice: price,
      nextPaymentDate: (() => {
        const d = new Date();
        d.setMonth(d.getMonth() + billingCycle);
        return d.toISOString();
      })(),
      memo,
      status: "Active"
    });
    navigate("/subscriptions");
  };

  const handleAddCustomService = () => {
    if (!customName.trim()) return;
    
    const newTemplate = {
      id: Math.random().toString(),
      name: customName,
      category: "Custom",
      price: 0,
      color: "from-slate-600 to-slate-800",
      icon: customIcon || customName.charAt(0),
      pageUrl: customUrl
    };
    
    addTemplate(newTemplate);
    setIsCustom(false);
    setCustomName("");
    setCustomIcon("");
    setCustomUrl("");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Add Subscription
        </h1>
        <p className="text-slate-400">
          Choose a popular service or add your own.
        </p>
      </header>

      {!selectedTemplate && !isCustom ? (
        <div className="space-y-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search services (e.g. Netflix)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${template.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg overflow-hidden`}
                >
                  {(template.icon || "").startsWith("data:image") ? (
                    <img src={template.icon} alt={template.name} className="w-full h-full object-cover" />
                  ) : (
                    template.icon || template.name.charAt(0)
                  )}
                </div>
                <span className="font-semibold">{template.name}</span>
              </button>
            ))}

            <button
              onClick={() => setIsCustom(true)}
              className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform border border-dashed border-slate-500/50 hover:border-purple-500"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-slate-400 bg-white/5">
                <Plus size={32} />
              </div>
              <span className="font-semibold text-slate-300">Custom</span>
            </button>
          </div>
        </div>
      ) : isCustom ? (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-2xl shadow-lg overflow-hidden">
              {customIcon ? (
                <img src={customIcon} alt="Custom Icon" className="w-full h-full object-cover" />
              ) : "C"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">New Custom Service</h2>
              <p className="text-slate-400">Add a custom service to your templates</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Icon (Image File)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => setCustomIcon(e.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30 text-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Gym Membership"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Manage URL (Optional)
              </label>
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setIsCustom(false)}
              className="flex-1 py-3 rounded-xl font-medium bg-slate-800 text-white hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCustomService}
              disabled={!customName.trim()}
              className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              Add Service
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedTemplate.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg overflow-hidden`}
            >
              {(selectedTemplate.icon || "").startsWith("data:image") ? (
                <img src={selectedTemplate.icon} alt={selectedTemplate.name} className="w-full h-full object-cover" />
              ) : (
                selectedTemplate.icon || selectedTemplate.name.charAt(0)
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {selectedTemplate.name}
              </h2>
              <p className="text-slate-400">
                {selectedTemplate.category}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Monthly Price (₩)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrice((p) => Math.max(0, p - 1000))}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition text-slate-300"
                >
                  <Minus size={20} />
                </button>
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₩</span>
                  <input
                    type="text"
                    value={price === 0 ? "" : price.toLocaleString()}
                    onChange={(e) => {
                      const val = e.target.value.replace(/,/g, "");
                      if (!isNaN(Number(val))) {
                        setPrice(Number(val));
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-center font-semibold text-lg"
                    placeholder="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setPrice((p) => p + 1000)}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition text-slate-300"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Categories (Hashtags)
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500 transition text-slate-300"
                >
                  <Plus size={16} />
                </button>
                {availableCategories.map(cat => {
                   const isSelected = selectedCategories.includes(cat);
                   return (
                     <button
                       key={cat}
                       type="button"
                       onClick={() => {
                         if (isSelected) {
                           setSelectedCategories(prev => prev.filter(c => c !== cat));
                         } else {
                           setSelectedCategories(prev => [...prev, cat]);
                         }
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
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Billing Cycle
              </label>
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
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Memo / Notes (Optional)
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-y"
                placeholder="e.g. Shared with family, Cancel before trial ends..."
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => {
                setSelectedTemplate(null);
                setPrice(0);
                setSelectedCategories([]);
                setBillingCycle(1);
                setMemo("");
              }}
              className="flex-1 py-3 rounded-xl font-medium bg-slate-800 text-white hover:bg-slate-700 transition"
            >
              Back
            </button>
            <button
              onClick={handleSaveSubscription}
              className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition flex items-center justify-center gap-2"
            >
              <CircleCheck size={20} />
              Save Subscription
            </button>
          </div>
        </div>
      )}

      <CategoryManageModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
      />
    </div>
  );
}
