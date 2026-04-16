import { useState } from "react";
import { Plus, Search, CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TEMPLATES = [
  {
    id: "1",
    name: "Netflix",
    category: "Entertainment",
    price: 17000,
    color: "from-red-600 to-red-900",
  },
  {
    id: "2",
    name: "Spotify",
    category: "Music",
    price: 10900,
    color: "from-green-500 to-emerald-700",
  },
  {
    id: "3",
    name: "YouTube Premium",
    category: "Entertainment",
    price: 14900,
    color: "from-red-500 to-rose-600",
  },
  {
    id: "4",
    name: "Apple Music",
    category: "Music",
    price: 8900,
    color: "from-slate-700 to-slate-900",
  },
  {
    id: "5",
    name: "Adobe Creative Cloud",
    category: "Productivity",
    price: 62000,
    color: "from-red-500 to-orange-500",
  },
];

export default function AddSubscription() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isCustom, setIsCustom] = useState(false);

  const filteredTemplates = TEMPLATES.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSave = () => {
    // 백엔드 연동 및 상태 저장 로직이 여기에 추가됩니다.
    navigate("/subscriptions");
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
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${template.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
                >
                  {template.name.charAt(0)}
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
      ) : (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedTemplate ? selectedTemplate.color : "from-indigo-500 to-purple-600"} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
            >
              {selectedTemplate ? selectedTemplate.name.charAt(0) : "C"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {selectedTemplate
                  ? selectedTemplate.name
                  : "Custom Subscription"}
              </h2>
              <p className="text-slate-400">
                {selectedTemplate
                  ? selectedTemplate.category
                  : "Add your custom details"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {isCustom && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. Gym Membership"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Monthly Price (₩)
              </label>
              <input
                type="number"
                defaultValue={selectedTemplate?.price || ""}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Next Payment Date
              </label>
              <input
                type="date"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Memo / Notes (Optional)
              </label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-y"
                placeholder="e.g. Shared with family, Cancel before trial ends..."
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => {
                setSelectedTemplate(null);
                setIsCustom(false);
              }}
              className="flex-1 py-3 rounded-xl font-medium bg-slate-800 text-white hover:bg-slate-700 transition"
            >
              Back
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition flex items-center justify-center gap-2"
            >
              <CircleCheck size={20} />
              Save Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
