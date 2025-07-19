import React from 'react';
import { CheckCircle, XCircle, ArrowLeft, User, Wallet, Globe, Calendar, FileText } from 'lucide-react';
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

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason);
      setIsRejecting(false);
      setRejectReason('');
    }
  };

  const commonReasons = [
    'Incomplete work',
    'Quality issues',
    'Incorrect amount',
    'Missing documentation',
    'Budget constraints',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Review</h1>
          <p className="text-gray-600">Review and approve payment request</p>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Status Banner */}
          <div className={`px-6 py-4 ${
            invoice.status === 'Pending' ? 'bg-orange-50 border-b border-orange-200' :
            invoice.status === 'Approved' ? 'bg-blue-50 border-b border-blue-200' :
            invoice.status === 'Paid' ? 'bg-green-50 border-b border-green-200' :
            'bg-red-50 border-b border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  invoice.status === 'Pending' ? 'bg-orange-500' :
                  invoice.status === 'Approved' ? 'bg-blue-500' :
                  invoice.status === 'Paid' ? 'bg-green-500' :
                  'bg-red-500'
                }`}></div>
                <span className={`font-medium ${
                  invoice.status === 'Pending' ? 'text-orange-800' :
                  invoice.status === 'Approved' ? 'text-blue-800' :
                  invoice.status === 'Paid' ? 'text-green-800' :
                  'text-red-800'
                }`}>
                  Status: {invoice.status}
                </span>
              </div>
              <code className="text-sm bg-white px-3 py-1 rounded border">
                {invoice.id}
              </code>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Freelancer Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <User size={20} />
                    <span>Freelancer Information</span>
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{invoice.freelancerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{invoice.freelancerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <p className="font-medium text-gray-900">{invoice.role}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Wallet size={20} />
                    <span>Payment Information</span>
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Wallet Address</p>
                      <code className="text-sm bg-white px-2 py-1 rounded border font-mono">
                        {invoice.walletAddress}
                      </code>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm text-gray-600">Network</p>
                        <div className="flex items-center space-x-2">
                          <Globe size={16} className="text-blue-500" />
                          <span className="font-medium text-blue-600">{invoice.network}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="text-2xl font-bold text-gray-900">{invoice.amount} ETH</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Work Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <FileText size={20} />
                    <span>Work Description</span>
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed">{invoice.description}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Calendar size={20} />
                    <span>Invoice Details</span>
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium text-gray-900">
                        {invoice.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Employer Email</p>
                      <p className="font-medium text-gray-900">{invoice.employerEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {invoice.status === 'Pending' && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={onApprove}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle size={20} />
                    <span>Approve & Pay</span>
                  </button>
                  <button
                    onClick={() => setIsRejecting(true)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <XCircle size={20} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reject Modal */}
        {isRejecting && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsRejecting(false)}></div>
              
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Invoice</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for rejection
                    </label>
                    <div className="space-y-2">
                      {commonReasons.map((reason) => (
                        <button
                          key={reason}
                          onClick={() => setRejectReason(reason)}
                          className={`w-full text-left px-3 py-2 rounded-lg border transition-colors duration-200 ${
                            rejectReason === reason 
                              ? 'border-red-500 bg-red-50 text-red-700' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                  </div>

                  {rejectReason === 'Other' && (
                    <div>
                      <textarea
                        rows={3}
                        placeholder="Please specify the reason..."
                        value={rejectReason === 'Other' ? '' : rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsRejecting(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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