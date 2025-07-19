import React from 'react';
import { Plus, User, Globe } from 'lucide-react';
import { WalletInfo, Invoice } from '../../types';
import InvoiceTable from './InvoiceTable';

interface DashboardProps {
  walletInfo: WalletInfo;
  invoices: Invoice[];
  onCreateInvoice: () => void;
}

export default function Dashboard({ walletInfo, invoices, onCreateInvoice }: DashboardProps) {
  const pendingInvoices = invoices.filter(inv => inv.status === 'Pending').length;
  const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
  const totalAmount = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your invoices and payments</p>
        </div>

        {/* Wallet Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Connected Wallet</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-500" />
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                    {walletInfo.address}
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe size={16} className="text-blue-500" />
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {walletInfo.network}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                <p className="text-2xl font-bold text-orange-600">{pendingInvoices}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                <p className="text-2xl font-bold text-green-600">{paidInvoices}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold text-blue-600">{totalAmount.toFixed(2)} ETH</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Invoice Button */}
        <div className="mb-8">
          <button
            onClick={onCreateInvoice}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create New Invoice</span>
          </button>
        </div>

        {/* Invoice Table */}
        <InvoiceTable invoices={invoices} />
      </div>
    </div>
  );
}