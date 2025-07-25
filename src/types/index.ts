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