import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = () => {
    if (userId) {
      const userNotifications = notificationService.getNotifications(userId);
      setNotifications(userNotifications);
      setUnreadCount(notificationService.getUnreadCount(userId));
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const refreshNotifications = () => {
    loadNotifications();
  };

  return {
    notifications,
    unreadCount,
    refreshNotifications
  };
}