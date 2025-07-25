import React from 'react';
import { X, Bell, CheckCheck } from 'lucide-react';
import { Notification } from '../../types';
import { notificationService } from '../../services/notificationService';

interface NotificationBannerProps {
  userId: string;
  notifications: Notification[];
  onNotificationsUpdate: () => void;
}

export default function NotificationBanner({ userId, notifications, onNotificationsUpdate }: NotificationBannerProps) {
  const [isDismissed, setIsDismissed] = React.useState(false);
  
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const highPriorityUnread = unreadNotifications.filter(n => n.priority === 'high');
  
  // Don't show banner if no unread notifications or if dismissed
  if (unreadNotifications.length === 0 || isDismissed) {
    return null;
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead(userId);
    onNotificationsUpdate();
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  // Reset dismissed state when new notifications arrive
  React.useEffect(() => {
    setIsDismissed(false);
  }, [notifications.length]);

  const getBannerStyle = () => {
    if (highPriorityUnread.length > 0) {
      // High priority notifications get more prominent styling
      const hasRejected = highPriorityUnread.some(n => n.type === 'invoice_rejected');
      const hasApproved = highPriorityUnread.some(n => n.type === 'invoice_approved' || n.type === 'invoice_paid');
      
      if (hasRejected) {
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      } else if (hasApproved) {
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      } else {
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
      }
    }
    
    return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
  };

  const getMessageText = () => {
    if (highPriorityUnread.length === 1) {
      return highPriorityUnread[0].title;
    } else if (highPriorityUnread.length > 1) {
      return `You have ${highPriorityUnread.length} important notifications`;
    } else {
      return `You have ${unreadNotifications.length} unread notification${unreadNotifications.length > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className={`border rounded-lg p-4 mb-6 transition-all duration-300 animate-slide-down ${getBannerStyle()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Bell size={20} className="animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {getMessageText()}
            </p>
            {highPriorityUnread.length === 1 && (
              <p className="text-sm opacity-90 mt-1">
                {highPriorityUnread[0].message}
              </p>
            )}
            {unreadNotifications.length > highPriorityUnread.length && (
              <p className="text-sm opacity-75 mt-1">
                Plus {unreadNotifications.length - highPriorityUnread.length} other notification{unreadNotifications.length - highPriorityUnread.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
          >
            <CheckCheck size={14} />
            <span>Mark all read</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}