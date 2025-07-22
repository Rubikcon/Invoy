import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';
import { Invoice } from '../../types';

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewInvoice?: (invoice: Invoice) => void;
}

export default function InvoiceTable({ invoices, onViewInvoice }: InvoiceTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center transition-colors duration-300">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Mail size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices yet</h3>
        <p className="text-gray-600 dark:text-gray-300">Create your first invoice to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Invoices</h2>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <code className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {invoice.id}
              </code>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <Mail size={14} className="text-gray-400" />
                <span className="text-gray-900 dark:text-white truncate">{invoice.employerEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-white">{invoice.amount} ETH</span>
                <button 
                  onClick={() => onViewInvoice?.(invoice)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-1"
                >
                  <ExternalLink size={12} />
                  <span className="text-xs">View</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Invoice ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Employer Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {invoice.id}
                  </code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">{invoice.employerEmail}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {invoice.amount} ETH
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => onViewInvoice?.(invoice)}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <ExternalLink size={14} />
                    <span className="text-sm">View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}