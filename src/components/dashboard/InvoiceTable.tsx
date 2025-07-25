import React from 'react';
import { Mail, ExternalLink, Trash2, Filter, ChevronLeft, ChevronRight, Calendar, Coins, Globe, User, Clock, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';
import { Invoice } from '../../types';

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewInvoice?: (invoice: Invoice) => void;
  onDeleteInvoice?: (invoiceId: string) => void;
}

type StatusFilter = 'All' | 'Pending' | 'Approved' | 'Paid' | 'Rejected' | 'Draft' | 'Cancelled';

export default function InvoiceTable({ invoices, onViewInvoice, onDeleteInvoice }: InvoiceTableProps) {
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('All');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);

  // Filter invoices based on status
  const filteredInvoices = React.useMemo(() => {
    if (statusFilter === 'All') return invoices;
    return invoices.filter(invoice => invoice.status === statusFilter);
  }, [invoices, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 'Cancelled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return Clock;
      case 'Approved':
        return CheckCircle;
      case 'Paid':
        return CheckCircle;
      case 'Rejected':
        return XCircle;
      case 'Draft':
        return FileText;
      case 'Cancelled':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const statusOptions: StatusFilter[] = ['All', 'Pending', 'Approved', 'Paid', 'Rejected', 'Draft', 'Cancelled'];

  if (invoices.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center transition-colors duration-300">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Mail size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices yet</h3>
        <p className="text-gray-600 dark:text-gray-300">Create your first invoice to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      {/* Header with Filters */}
      <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Invoices</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {filteredInvoices.length} of {invoices.length} invoices
            </p>
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Status' : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Filter size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            No invoices match the selected filter: {statusFilter}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden">
            {paginatedInvoices.map((invoice) => {
              const StatusIcon = getStatusIcon(invoice.status);
              return (
                <div 
                  key={invoice.id} 
                  className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                  onClick={() => onViewInvoice?.(invoice)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <code className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {invoice.id}
                    </code>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      <StatusIcon size={12} className="mr-1" />
                      {invoice.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User size={14} className="text-gray-400" />
                        <span className="text-gray-900 dark:text-white truncate">{invoice.employerEmail}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Coins size={14} className="text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">{invoice.amount} {invoice.token}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe size={14} className="text-blue-500" />
                        <span className="text-blue-600 dark:text-blue-400 text-xs">{invoice.network}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                          Sent: {formatDate(invoice.sentDate)}
                        </span>
                      </div>
                      {invoice.paidDate && (
                        <span className="text-green-600 dark:text-green-400 text-xs">
                          Paid: {formatDate(invoice.paidDate)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewInvoice?.(invoice);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-1"
                      >
                        <ExternalLink size={12} />
                        <span className="text-xs">View</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteInvoice?.(invoice.id);
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center space-x-1"
                      >
                        <Trash2 size={12} />
                        <span className="text-xs">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
                    Employer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Network
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Sent Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Paid Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedInvoices.map((invoice) => {
                  const StatusIcon = getStatusIcon(invoice.status);
                  return (
                    <tr 
                      key={invoice.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                      onClick={() => onViewInvoice?.(invoice)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {invoice.id}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Mail size={16} className="text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                              {invoice.employerEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Coins size={16} className="text-yellow-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {invoice.token}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Globe size={16} className="text-blue-500" />
                          <span className="text-sm text-blue-600 dark:text-blue-400">
                            {invoice.network}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          <StatusIcon size={12} className="mr-1" />
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(invoice.sentDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.paidDate ? (
                          <div className="flex items-center space-x-2">
                            <Calendar size={14} className="text-green-500" />
                            <span className="text-sm text-green-600 dark:text-green-400">
                              {formatDate(invoice.paidDate)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewInvoice?.(invoice);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-1"
                          >
                            <ExternalLink size={14} />
                            <span className="text-sm">View</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteInvoice?.(invoice.id);
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center space-x-1"
                          >
                            <Trash2 size={14} />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} results
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}