import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { fetchApi } from "../utils/api";
import { useAuth } from "./AuthContext";
import type { Subscription } from "../models/types";

export interface ServiceTemplate {
  id: string;
  name: string;
  category?: string;
  categories?: string[];
  price: number;
  color: string;
  icon?: string;
  pageUrl?: string;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (sub: Subscription) => void;
  updateSubscription: (id: string, updatedSub: Partial<Subscription>) => void;
  templates: ServiceTemplate[];
  addTemplate: (template: ServiceTemplate) => void;
  editTemplate: (id: string, updated: Partial<ServiceTemplate>) => void;
  deleteTemplate: (id: string) => void;
  availableCategories: string[];
  addCategory: (cat: string) => void;
  editCategory: (oldCat: string, newCat: string) => void;
  deleteCategory: (cat: string) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

// Initial Dummy Data to keep Dashboard and List looking good initially
const initialSubscriptions: Subscription[] = [
  {
    id: "1",
    template: {
      templateName: "Netflix",
      price: 17000,
      category: "Entertainment",
      pageUrl: "https://netflix.com/cancel",
      calender: "Monthly",
    },
    name: "Netflix",
    category: "Entertainment",
    cycle: "Monthly",
    status: "Active",
    selectedPrice: 17000,
    nextPaymentDate: "2026-04-18T00:00:00.000Z",
  },
  {
    id: "2",
    template: {
      templateName: "Spotify",
      price: 10900,
      category: "Music",
      pageUrl: "https://spotify.com/cancel",
      calender: "Monthly",
    },
    name: "Spotify",
    category: "Music",
    cycle: "Monthly",
    status: "Active",
    selectedPrice: 10900,
    nextPaymentDate: "2026-04-22T00:00:00.000Z",
  },
  {
    id: "3",
    template: {
      templateName: "YouTube Premium",
      price: 14900,
      category: "Entertainment",
      pageUrl: "https://youtube.com/cancel",
      calender: "Monthly",
    },
    name: "YouTube Premium",
    category: "Entertainment",
    cycle: "Monthly",
    status: "Active",
    selectedPrice: 14900,
    nextPaymentDate: "2026-05-02T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Adobe Creative Cloud",
    category: "Productivity",
    cycle: "Yearly",
    status: "Paused",
    selectedPrice: 62000,
    nextPaymentDate: "2027-01-01T00:00:00.000Z",
  },
];

const initialTemplates: ServiceTemplate[] = [
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

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(initialSubscriptions);
  const [templates, setTemplates] = useState<ServiceTemplate[]>(initialTemplates);
  const [availableCategories, setAvailableCategories] = useState<string[]>([
    "Entertainment", "Music", "Productivity", "Games", "Education", "Utilities", "Lifestyle"
  ]);

  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      // If not logged in, we could clear data or keep dummy data.
      if (!user) {
        setSubscriptions(initialSubscriptions);
        setTemplates(initialTemplates);
        return;
      }

      try {
        const response = await fetchApi('/api/subscriptions');
        if (response.ok) {
          const data = await response.json();
          setSubscriptions(data || []);
        }

        const tmplResponse = await fetchApi('/api/templates');
        if (tmplResponse.ok) {
          const tmplData = await tmplResponse.json();
          setTemplates([...initialTemplates, ...(tmplData || [])]);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    loadData();
  }, [user]);

  const addSubscription = async (sub: Subscription) => {
    try {
      // Remove local dummy ID and template field (which is unused by the backend)
      const { id, template, ...subToSave } = sub;
      
      const response = await fetchApi('/api/subscriptions', {
        method: 'POST',
        body: JSON.stringify(subToSave)
      });
      if (response.ok) {
        const savedSub = await response.json();
        setSubscriptions((prev) => [...prev, savedSub]);
      } else {
        console.error("Failed to save subscription");
        // Fallback to local state if saving fails
        setSubscriptions((prev) => [...prev, sub]);
      }
    } catch (err) {
      console.error("Error saving subscription:", err);
      // Fallback to local state
      setSubscriptions((prev) => [...prev, sub]);
    }
  };

  const updateSubscription = async (id: string | number, updatedSub: Partial<Subscription>) => {
    // Optimistic update for snappy UI
    setSubscriptions((prev) =>
      prev.map((sub) => (String(sub.id) === String(id) ? { ...sub, ...updatedSub } : sub)),
    );

    try {
      const response = await fetchApi(`/api/subscriptions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedSub)
      });
      if (!response.ok) {
        console.error("Failed to update subscription in DB");
        // We could revert the optimistic update here if needed
      }
    } catch (err) {
      console.error("Error updating subscription in DB:", err);
    }
  };

  const addTemplate = async (template: ServiceTemplate) => {
    setTemplates((prev) => [...prev, template]);
    try {
      const { id, ...templateToSave } = template as any;
      const response = await fetchApi('/api/templates', {
        method: 'POST',
        body: JSON.stringify(templateToSave)
      });
      if (response.ok) {
        const savedTemplate = await response.json();
        setTemplates(prev => prev.map(t => t.id === template.id ? savedTemplate : t));
      }
    } catch (err) {
      console.error("Error saving template", err);
    }
  };

  const editTemplate = async (id: string, updated: Partial<ServiceTemplate>) => {
    setTemplates((prev) =>
      prev.map((t) => (String(t.id) === String(id) ? { ...t, ...updated } : t))
    );
    try {
      await fetchApi(`/api/templates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error("Error updating template", err);
    }
  };

  const deleteTemplate = async (id: string) => {
    setTemplates((prev) => prev.filter((t) => String(t.id) !== String(id)));
    try {
      await fetchApi(`/api/templates/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Error deleting template", err);
    }
  };

  const addCategory = (cat: string) => {
    if (!availableCategories.includes(cat)) {
      setAvailableCategories(prev => [...prev, cat]);
    }
  };

  const editCategory = (oldCat: string, newCat: string) => {
    setAvailableCategories(prev => prev.map(c => c === oldCat ? newCat : c));
    // Optionally update all subscriptions that use this category, but usually just updating the list is enough
  };

  const deleteCategory = (cat: string) => {
    setAvailableCategories(prev => prev.filter(c => c !== cat));
  };

  return (
    <SubscriptionContext.Provider
      value={{ 
        subscriptions, addSubscription, updateSubscription,
        templates, addTemplate, editTemplate, deleteTemplate,
        availableCategories, addCategory, editCategory, deleteCategory
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscriptions must be used within a SubscriptionProvider",
    );
  }
  return context;
};
