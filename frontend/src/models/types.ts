export interface SubscriptionTemplate {
  templateName: string;
  price: number;
  category: string;
  pageUrl: string;
  calender: string;
}

export interface Subscription {
  id?: string;
  template?: SubscriptionTemplate;
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
