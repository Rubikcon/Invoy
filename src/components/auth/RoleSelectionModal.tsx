import React from 'react';
import { X, Briefcase, Users } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'freelancer' | 'employer') => void;
  userName: string;
  isLoading: boolean;
}

export default function RoleSelectionModal({ 
  isOpen, 
  onClose, 
  onSelectRole, 
  userName, 
  isLoading 
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = React.useState<'freelancer' | 'employer' | null>(null);

  const handleSubmit = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4">
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {userName}!</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              To get started, please select your role:
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <button
              onClick={() => setSelectedRole('freelancer')}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-4 ${
                selectedRole === 'freelancer'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedRole === 'freelancer' 
                  ? 'bg-blue-100 dark:bg-blue-900/30' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <Briefcase size={24} className={selectedRole === 'freelancer' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Freelancer</h3>
                <p className="text-sm opacity-80">Create and send invoices to clients</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('employer')}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-4 ${
                selectedRole === 'employer'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedRole === 'employer' 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <Users size={24} className={selectedRole === 'employer' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Employer</h3>
                <p className="text-sm opacity-80">Review and approve invoices from freelancers</p>
              </div>
            </button>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedRole || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Setting up...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}