import React from 'react';
import { X, Wallet, Globe, AlertCircle, Coins, Save, Send, Eye, EyeOff } from 'lucide-react';
import { CreateInvoiceData } from '../../types';
import MDEditor from '@uiw/react-md-editor';
import { useToast } from '../../hooks/useToast';
import { invoiceService } from '../../services/invoiceService';
import { useBlockchain } from '../../hooks/useBlockchain';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInvoiceData, isDraft?: boolean) => void;
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
  const { success, error, warning } = useToast();
  const { registerInvoice: registerOnBlockchain, generateInvoiceHash, isInitialized: blockchainInitialized } = useBlockchain();
  const [formData, setFormData] = React.useState<CreateInvoiceData>({
    fullName: '',
    email: '',
    walletAddress: walletAddress,
    network: currentNetwork,
    token: 'ETH',
    role: '',
    description: '',
    amount: '',
    employerEmail: ''
  });
  
  const [errors, setErrors] = React.useState<Partial<CreateInvoiceData>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSavingDraft, setIsSavingDraft] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [networkWarning, setNetworkWarning] = React.useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        walletAddress: walletAddress,
        network: currentNetwork,
        token: 'ETH'
      }));
      setNetworkWarning('');
      setShowPreview(false);
    }
  }, [isOpen, walletAddress, currentNetwork]);

  // Check network compatibility
  React.useEffect(() => {
    if (formData.network && currentNetwork) {
      const validation = invoiceService.validateNetworkCompatibility(formData.network, currentNetwork);
      if (!validation.isCompatible && validation.warning) {
        setNetworkWarning(validation.warning);
      } else {
        setNetworkWarning('');
      }
    }
  }, [formData.network, currentNetwork]);

  const networks = [
    'Ethereum',
    'Polygon',
    'Arbitrum',
    'Optimism',
    'Base',
    'Lisk Sepolia'
  ];

  const tokens = [
    'ETH',
    'USDC',
    'USDT',
    'DAI',
    'MATIC',
    'ARB'
  ];

  const validateForm = (): boolean => {
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

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSavingDraft(true);
    try {
      const result = await invoiceService.saveDraft(formData);
      
      if (result.success) {
        success('Draft Saved', 'Invoice draft saved successfully');
        onSubmit(formData, true);
        onClose();
      } else {
        error('Save Failed', result.message);
      }
    } catch (err: any) {
      error('Save Failed', err.message || 'Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Show warning if network mismatch
    if (networkWarning) {
      const proceed = window.confirm(
        `${networkWarning}\n\nDo you want to proceed anyway? This may cause payment issues.`
      );
      if (!proceed) return;
    }

    setIsSubmitting(true);
    try {
      const result = await invoiceService.submitInvoice(formData);
      
      if (result.success) {
        // Register on blockchain if available
        if (blockchainInitialized && result.invoice) {
          try {
            const blockchainResult = await registerOnBlockchain(
              result.invoice,
              walletAddress,
              '0x70997970C51812dc3A0108C7D58634959790A732' // Valid dummy address for development
            );
            
            if (blockchainResult.success) {
              success('Invoice Created', 'Invoice submitted and registered on blockchain successfully');
            } else {
              success('Invoice Created', 'Invoice submitted successfully (blockchain registration pending)');
              warning('Blockchain Warning', blockchainResult.message);
            }
          } catch (blockchainError) {
            success('Invoice Created', 'Invoice submitted successfully (blockchain unavailable)');
          }
        } else {
          success('Invoice Sent', 'Invoice submitted successfully and ready to send to employer');
        }
        
        success('Invoice Sent', 'Invoice submitted and notification sent to employer');
        onSubmit(formData, false);
        onClose();
      } else {
        error('Submission Failed', result.message);
      }
    } catch (err: any) {
      error('Submission Failed', err.message || 'Failed to submit invoice');
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="fixed inset-0 z-50 overflow-y-auto p-4" data-color-mode="light">
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl p-4 md:p-8 max-h-[90vh] overflow-y-auto transition-colors duration-300">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Create Invoice</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 flex items-center space-x-1"
              >
                {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
                <span className="text-sm hidden sm:inline">{showPreview ? 'Edit' : 'Preview'}</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Network Warning */}
          {networkWarning && (
            <div className="mb-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle size={20} className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">Network Mismatch Warning</h4>
                  <p className="text-orange-700 dark:text-orange-300 text-sm">{networkWarning}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange('fullName')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.fullName ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role or Title *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={handleChange('role')}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.role ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wallet Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Wallet Address *
                </label>
                <div className="relative">
                  <Wallet size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.walletAddress}
                    onChange={handleChange('walletAddress')}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.walletAddress ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm`}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Network *
                </label>
                <div className="relative">
                  <Globe size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.network}
                    onChange={handleChange('network')}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Work Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Description *
                </label>
                {showPreview ? (
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 min-h-[120px]">
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ 
                        __html: formData.description
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/`(.*?)`/g, '<code>$1</code>')
                          .replace(/\n/g, '<br>')
                      }}
                    />
                  </div>
                ) : (
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <MDEditor
                      value={formData.description}
                      onChange={(value) => setFormData(prev => ({ ...prev, description: value || '' }))}
                      preview="edit"
                      hideToolbar={false}
                      height={200}
                      data-color-mode="light"
                      className="!border-0"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supports Markdown: **bold**, *italic*, `code`, lists, and links
                </p>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (ETH) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.amount}
                    onChange={handleChange('amount')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.amount ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Token *
                  </label>
                  <div className="relative">
                    <Coins size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={formData.token}
                      onChange={handleChange('token')}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {tokens.map((token) => (
                        <option key={token} value={token}>
                          {token}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Employer's Email *
                  </label>
                  <input
                    type="email"
                    value={formData.employerEmail}
                    onChange={handleChange('employerEmail')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.employerEmail ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
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

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || isSavingDraft}
                className="w-full md:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting || isSavingDraft}
                className="w-full md:w-auto px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSavingDraft ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Draft</span>
                  </>
                )}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isSavingDraft}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Invoice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}