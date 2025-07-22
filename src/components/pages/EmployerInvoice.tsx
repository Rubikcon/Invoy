import React from 'react';
import { CheckCircle, XCircle, ArrowLeft, User, Wallet, Globe, Calendar, FileText, Shield, AlertTriangle, Clock } from 'lucide-react';
import { Invoice } from '../../types';

interface EmployerInvoiceProps {
  invoice: Invoice;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onBack: () => void;
}

export default function EmployerInvoice({ invoice, onApprove, onReject, onBack }: EmployerInvoiceProps) {
  const [isRejecting, setIsRejecting] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      onApprove();
      setIsProcessing(false);
    }, 2000);
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason);
      setIsRejecting(false);
      setRejectReason('');
    }
  };

  const commonReasons = [
    'Work not completed as specified',
    'Quality does not meet requirements',
    'Incorrect invoice amount',
    'Missing deliverables or documentation',
    'Budget constraints',
    'Need more time to review',
    'Other (please specify)'
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Pending':
        return {
          color: 'orange',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          textColor: 'text-orange-800 dark:text-orange-200',
          icon: Clock,
          message: 'This invoice is awaiting your review and approval.'
        };
      case 'Approved':
        return {
          color: 'blue',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-800 dark:text-blue-200',
          icon: CheckCircle,
          message: 'This invoice has been approved and payment is being processed.'
        };
      case 'Paid':
        return {
          color: 'green',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-200',
          icon: CheckCircle,
          message: 'Payment has been completed successfully.'
        };
      case 'Rejected':
        return {
          color: 'red',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200',
          icon: XCircle,
          message: 'This invoice has been rejected.'
        };
      default:
        return {
          color: 'gray',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          textColor: 'text-gray-800 dark:text-gray-200',
          icon: AlertTriangle,
          message: 'Unknown status.'
        };
    }
  };

  const statusInfo = getStatusInfo(invoice.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Invoice Review</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Review work details and approve payment</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield size={20} className="text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Secure Review Portal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-2xl p-6 mb-8 transition-colors duration-300`}>
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 bg-${statusInfo.color}-100 dark:bg-${statusInfo.color}-900/30 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <StatusIcon size={24} className={`text-${statusInfo.color}-600 dark:text-${statusInfo.color}-400`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className={`text-lg font-semibold ${statusInfo.textColor}`}>
                  Invoice Status: {invoice.status}
                </h2>
                <code className="text-sm bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-mono">
                  {invoice.id}
                </code>
              </div>
              <p className={`${statusInfo.textColor} opacity-90`}>
                {statusInfo.message}
              </p>
            </div>
          </div>
        </div>

        {/* Main Invoice Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Request</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Created on {invoice.createdAt.toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{invoice.amount} ETH</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">on {invoice.network}</p>
              </div>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Freelancer Info */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <User size={20} className="text-blue-500" />
                    <span>Freelancer Information</span>
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-4 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Full Name</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">{invoice.freelancerName}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <User size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Email Address</p>
                      <p className="font-medium text-gray-900 dark:text-white break-all">{invoice.freelancerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Role/Position</p>
                      <span className="inline-flex px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                        {invoice.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Wallet size={20} className="text-green-500" />
                    <span>Payment Details</span>
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-4 transition-colors duration-300">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Wallet Address</p>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                        <code className="text-sm font-mono text-gray-900 dark:text-white break-all">
                          {invoice.walletAddress}
                        </code>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Network</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Globe size={16} className="text-blue-500" />
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{invoice.network}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Amount</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{invoice.amount} ETH</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Work Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <FileText size={20} className="text-purple-500" />
                    <span>Work Description</span>
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-colors duration-300">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {invoice.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Calendar size={20} className="text-orange-500" />
                    <span>Invoice Information</span>
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3 transition-colors duration-300">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Invoice ID</span>
                      <code className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        {invoice.id}
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Created Date</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {invoice.createdAt.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Your Email</span>
                      <span className="font-medium text-gray-900 dark:text-white break-all">
                        {invoice.employerEmail}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {invoice.status === 'Pending' && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-blue-800 dark:text-blue-200">Review Required</h5>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                        Please review the work details and payment information carefully before making a decision.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={24} />
                        <span>Approve & Pay {invoice.amount} ETH</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsRejecting(true)}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle size={24} />
                    <span>Reject Invoice</span>
                  </button>
                </div>
              </div>
            )}

            {/* Status Message for Non-Pending Invoices */}
            {invoice.status !== 'Pending' && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-4 text-center`}>
                  <StatusIcon size={32} className={`text-${statusInfo.color}-600 dark:text-${statusInfo.color}-400 mx-auto mb-2`} />
                  <p className={`font-medium ${statusInfo.textColor}`}>
                    {invoice.status === 'Paid' && 'Payment completed successfully!'}
                    {invoice.status === 'Approved' && 'Payment is being processed...'}
                    {invoice.status === 'Rejected' && 'This invoice has been rejected.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Shield size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Secure Payment:</strong> This invoice has been verified for network compatibility and wallet address validation.
              </p>
            </div>
          </div>
        </div>

        {/* Reject Modal */}
        {isRejecting && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsRejecting(false)}></div>
              
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <XCircle size={20} className="text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reject Invoice</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Please select a reason for rejecting this invoice. This will help the freelancer understand your decision.
                </p>
                
                <div className="space-y-3 mb-6">
                  {commonReasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setRejectReason(reason)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                        rejectReason === reason 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 shadow-sm' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                {rejectReason === 'Other (please specify)' && (
                  <div className="mb-6">
                    <textarea
                      rows={3}
                      placeholder="Please specify the reason for rejection..."
                      value={rejectReason === 'Other (please specify)' ? '' : rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsRejecting(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}