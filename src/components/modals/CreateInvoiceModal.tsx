import React from 'react';
import { X, Wallet, Globe, AlertCircle } from 'lucide-react';
import { CreateInvoiceData } from '../../types';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInvoiceData) => void;
  walletAddress: string;
  currentNetwork: string;
}

export default function CreateInvoiceModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  walletAddress, 
  currentNetwork 
}: CreateInvoiceModalProps) {
  const [formData, setFormData] = React.useState<CreateInvoiceData>({
    fullName: '',
    email: '',
    walletAddress: walletAddress,
    network: currentNetwork,
    role: '',
    description: '',
    amount: '',
    employerEmail: ''
  });
  
  const [errors, setErrors] = React.useState<Partial<CreateInvoiceData>>({});

  React.useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        walletAddress: walletAddress,
        network: currentNetwork
      }));
    }
  }, [isOpen, walletAddress, currentNetwork]);

  const networks = [
    'Ethereum',
    'Polygon',
    'Arbitrum',
    'Optimism',
    'Base'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Partial<CreateInvoiceData> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!formData.walletAddress.trim()) newErrors.walletAddress = 'Wallet address is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount.trim()) newErrors.amount = 'Amount is required';
    if (!formData.employerEmail.trim()) newErrors.employerEmail = 'Employer email is required';
    if (!formData.employerEmail.includes('@')) newErrors.employerEmail = 'Please enter a valid email';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    onClose();
    setFormData({
      fullName: '',
      email: '',
      walletAddress: walletAddress,
      network: currentNetwork,
      role: '',
      description: '',
      amount: '',
      employerEmail: ''
    });
    setErrors({});
  };

  const handleChange = (field: keyof CreateInvoiceData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Invoice</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange('fullName')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.fullName ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role or Title *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={handleChange('role')}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.role ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Frontend Developer"
                />
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.role}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Wallet Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Wallet Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address *
                </label>
                <div className="relative">
                  <Wallet size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.walletAddress}
                    onChange={handleChange('walletAddress')}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.walletAddress ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm`}
                    placeholder="0x..."
                  />
                </div>
                {errors.walletAddress && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.walletAddress}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network *
                </label>
                <div className="relative">
                  <Globe size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.network}
                    onChange={handleChange('network')}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {networks.map((network) => (
                      <option key={network} value={network}>
                        {network}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Work Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description of Work *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={handleChange('description')}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none`}
                  placeholder="Describe the work you completed..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (ETH) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.amount}
                    onChange={handleChange('amount')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.amount ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="0.0"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.amount}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employer's Email *
                  </label>
                  <input
                    type="email"
                    value={formData.employerEmail}
                    onChange={handleChange('employerEmail')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.employerEmail ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="employer@company.com"
                  />
                  {errors.employerEmail && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.employerEmail}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Send Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}