import React from 'react';
import { ArrowLeft, User, Wallet, Globe, Calendar, FileText, Copy, Mail, ExternalLink } from 'lucide-react';
import { Invoice } from '../../types';
import { openEmailClient } from '../../services/emailService';

interface FreelancerInvoiceViewProps {
  invoice: Invoice;
  onBack: () => void;
}

export default function FreelancerInvoiceView({ invoice, onBack }: FreelancerInvoiceViewProps) {
  const [copied, setCopied] = React.useState(false);

  const invoiceLink = `${window.location.origin}/invoice/${invoice.id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(invoiceLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const sendEmail = () => {
    const emailData = {
      employerEmail: invoice.employerEmail,
      freelancerName: invoice.freelancerName,
      freelancerEmail: invoice.freelancerEmail,
      invoiceId: invoice.id,
      amount: invoice.amount,
      network: invoice.network,
      description: invoice.description,
      invoiceLink: invoiceLink
    };
    
    openEmailClient(emailData);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Invoice Details</h1>
          <p className="text-gray-600 dark:text-gray-300">View your invoice and share with employer</p>
        </div>

        {/* Invoice Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          {/* Status Banner */}
          <div className={`px-6 py-4 ${
            invoice.status === 'Pending' ? 'bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800' :
            invoice.status === 'Approved' ? 'bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800' :
            invoice.status === 'Paid' ? 'bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800' :
            'bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800'
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
                  invoice.status === 'Pending' ? 'text-orange-800 dark:text-orange-200' :
                  invoice.status === 'Approved' ? 'text-blue-800 dark:text-blue-200' :
                  invoice.status === 'Paid' ? 'text-green-800 dark:text-green-200' :
                  'text-red-800 dark:text-red-200'
                }`}>
                  Status: {invoice.status}
                </span>
              </div>
              <code className="text-sm bg-white dark:bg-gray-800 px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                {invoice.id}
              </code>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Your Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <User size={20} />
                    <span>Your Information</span>
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3 transition-colors duration-300">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{invoice.freelancerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white break-all">{invoice.freelancerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Role</p>
                      <p className="font-medium text-gray-900 dark:text-white">{invoice.role}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Wallet size={20} />
                    <span>Payment Information</span>
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3 transition-colors duration-300">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Wallet Address</p>
                      <code className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 font-mono text-gray-900 dark:text-white break-all">
                        {invoice.walletAddress}
                      </code>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Network</p>
                        <div className="flex items-center space-x-2">
                          <Globe size={16} className="text-blue-500" />
                          <span className="font-medium text-blue-600 dark:text-blue-400">{invoice.network}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Amount</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{invoice.amount} ETH</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Work Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <FileText size={20} />
                    <span>Work Description</span>
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-colors duration-300">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{invoice.description}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Calendar size={20} />
                    <span>Invoice Details</span>
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3 transition-colors duration-300">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Created</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {invoice.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Employer Email</p>
                      <p className="font-medium text-gray-900 dark:text-white break-all">{invoice.employerEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Invoice Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share Invoice with Employer</h3>
              
              {/* Invoice Link */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Invoice Review Link</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 font-mono text-gray-900 dark:text-white break-all">
                    {invoiceLink}
                  </code>
                  <button
                    onClick={copyLink}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Copy size={16} />
                    <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={sendEmail}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Mail size={20} />
                  <span>Send Email to Employer</span>
                </button>
                <button
                  onClick={() => window.open(invoiceLink, '_blank')}
                  className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ExternalLink size={20} />
                  <span>Preview Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}