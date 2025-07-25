import React from 'react';
import { User, Mail, Calendar, Shield, Wallet, Edit2, Save, X } from 'lucide-react';
import { User as UserType } from '../../types';

interface UserProfileProps {
  isOpen: boolean;
  user: UserType;
  onUpdateProfile: (updates: Partial<Pick<UserType, 'name' | 'avatar' | 'walletAddress'>>) => Promise<boolean>;
  onClose: () => void;
  isLoading: boolean;
}

export default function UserProfile({ isOpen, user, onUpdateProfile, onClose, isLoading }: UserProfileProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user.name,
    walletAddress: user.walletAddress || ''
  });
  const [errors, setErrors] = React.useState<{ name?: string; walletAddress?: string }>({});

  const handleSave = async () => {
    const newErrors: { name?: string; walletAddress?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.walletAddress && !/^0x[a-fA-F0-9]{40}$/.test(formData.walletAddress)) {
      newErrors.walletAddress = 'Please enter a valid wallet address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await onUpdateProfile({
      name: formData.name,
      walletAddress: formData.walletAddress || undefined
    });

    if (success) {
      setIsEditing(false);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      walletAddress: user.walletAddress || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4">
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <User size={18} className="text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{user.name}</span>
                  </div>
                )}
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{user.email}</span>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Shield size={18} className="text-gray-400" />
                  <span className="text-gray-900 dark:text-white capitalize">{user.role}</span>
                </div>
              </div>

              {/* Wallet Address */}
              {user.role === 'freelancer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Wallet Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.walletAddress}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, walletAddress: e.target.value }));
                        if (errors.walletAddress) setErrors(prev => ({ ...prev, walletAddress: undefined }));
                      }}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.walletAddress ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm`}
                      placeholder="0x..."
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Wallet size={18} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white font-mono text-sm">
                        {user.walletAddress || 'Not connected'}
                      </span>
                    </div>
                  )}
                  {errors.walletAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.walletAddress}</p>
                  )}
                </div>
              )}

              {/* Member Since */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Member Since
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {user.createdAt.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Edit2 size={16} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}