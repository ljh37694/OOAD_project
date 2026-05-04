import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
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

  const addSubscription = (sub: Subscription) => {
    setSubscriptions((prev) => [...prev, sub]);
  };

  const updateSubscription = (id: string, updatedSub: Partial<Subscription>) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updatedSub } : sub)),
    );
  };

  const addTemplate = (template: ServiceTemplate) => {
    setTemplates((prev) => [...prev, template]);
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
        templates, addTemplate,
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
