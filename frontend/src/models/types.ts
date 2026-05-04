export interface SubscriptionTemplate {
  templateName: string;
  price: number;
  category?: string;
  categories?: string[];
  pageUrl: string;
  calender: string;
  icon?: string;
}

export interface Subscription {
  id?: string;
  template?: SubscriptionTemplate;
  name?: string;
  icon?: string;
  category?: string;
  categories?: string[];
  cycle?: string;
  status?: string;
  memo?: string;
  selectedPrice: number;
  nextPaymentDate: string; // ISO date string
}

export interface User {
  googleEmail: string;
  nickname: string;
  provider: string; // e.g., 'Google'
}

export interface Notification {
  id?: string;
  message: string;
  sendDate: string;
  isRead: boolean;
}

export interface Dashboard {
  spendingByCategoryData: Record<string, number>;
  monthlySpendingTrendData: Record<string, number>;
}

export interface PaymentsHistory {
  id?: string;
  paymentDate: string;
  amount: number;
}
