export interface Invoice {
  id: string;
  employerEmail: string;
  amount: string;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected' | 'Draft' | 'Cancelled';
  freelancerName: string;
  freelancerEmail: string;
  walletAddress: string;
  network: string;
  token: string;
  role: string;
  description: string;
  createdAt: Date;
  sentDate?: Date;
  paidDate?: Date;
}

export interface CreateInvoiceData {
  fullName: string;
  email: string;
  walletAddress: string;
  network: string;
  token: string;
  role: string;
  description: string;
  amount: string;
  employerEmail: string;
}

export interface WalletInfo {
  address: string;
  network: string;
  isConnected: boolean;
}

export type View = 'landing' | 'dashboard' | 'employer-dashboard' | 'employer-invoice' | 'about-us' | 'freelancer-invoice-view';

export type UserType = 'freelancer' | 'employer';

export interface Notification {
  id: string;
  type: 'invoice_approved' | 'invoice_rejected' | 'invoice_paid' | 'new_invoice' | 'payment_received' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  invoiceId?: string;
  priority: 'low' | 'medium' | 'high';
}