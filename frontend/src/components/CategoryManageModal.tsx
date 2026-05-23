import { useState } from "react";
import { X, Plus, Edit2, Trash2, Check } from "lucide-react";
import { useSubscriptions } from "../context/SubscriptionContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryManageModal({ isOpen, onClose }: Props) {
  const { availableCategories, addCategory, editCategory, deleteCategory } = useSubscriptions();
  const [newCategory, setNewCategory] = useState("");
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newCategory.trim() && !availableCategories.includes(newCategory.trim())) {
      addCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  const handleSaveEdit = (oldCat: string) => {
    if (editValue.trim() && editValue.trim() !== oldCat && !availableCategories.includes(editValue.trim())) {
      editCategory(oldCat, editValue.trim());
    }
    setEditingCat(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="glass-panel p-8 rounded-3xl w-full max-w-md relative shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">해시태그 관리</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition bg-white/5 hover:bg-white/10 w-9 h-9 flex items-center justify-center rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="새 해시태그..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleAdd}
            disabled={!newCategory.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white p-3 rounded-xl transition flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {availableCategories.map(cat => (
            <div key={cat} className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl">
              {editingCat === cat ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(cat)}
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    autoFocus
                  />
                  <button onClick={() => handleSaveEdit(cat)} className="text-emerald-400 hover:text-emerald-300 p-1">
                    <Check size={18} />
                  </button>
                  <button onClick={() => setEditingCat(null)} className="text-slate-400 hover:text-slate-300 p-1">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium text-slate-200">#{cat}</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => {
                        setEditingCat(cat);
                        setEditValue(cat);
                      }}
                      className="text-slate-400 hover:text-blue-400 transition p-1.5 rounded-lg hover:bg-white/5"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteCategory(cat)}
                      className="text-slate-400 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-white/5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {availableCategories.length === 0 && (
            <p className="text-center text-slate-500 py-4">등록된 해시태그가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
