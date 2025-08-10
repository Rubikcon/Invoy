import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600 dark:text-green-400'
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          icon: XCircle,
          iconColor: 'text-red-600 dark:text-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: AlertCircle,
          iconColor: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-200',
          icon: Info,
          iconColor: 'text-blue-600 dark:text-blue-400'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          text: 'text-gray-800 dark:text-gray-200',
          icon: Info,
          iconColor: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const styles = getToastStyles();
  const IconComponent = styles.icon;

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4 max-w-sm w-full animate-slide-in transition-colors duration-300`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <IconComponent size={20} className={styles.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${styles.text}`}>
            {title}
          </p>
          {message && (
            <p className={`text-sm ${styles.text} opacity-90 mt-1`}>
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className={`flex-shrink-0 ${styles.iconColor} hover:opacity-75 transition-opacity duration-200`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}