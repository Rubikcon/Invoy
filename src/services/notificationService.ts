// Notification service for managing in-app notifications
import { Notification } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'invoy_notifications';

export interface NotificationData {
  id: string;
  type: 'invoice_approved' | 'invoice_rejected' | 'invoice_paid' | 'new_invoice' | 'payment_received' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  invoiceId?: string;
  priority: 'low' | 'medium' | 'high';
  userId: string; // wallet address or user identifier
}

export const notificationService = {
  // Get notifications for a specific user
  getNotifications(userId: string): Notification[] {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const allNotifications: NotificationData[] = stored ? JSON.parse(stored) : [];
      
      return allNotifications
        .filter(notification => notification.userId === userId)
        .map(notification => ({
          ...notification,
          createdAt: new Date(notification.createdAt)
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  },

  // Add a new notification
  addNotification(notification: Omit<NotificationData, 'id' | 'createdAt' | 'isRead'>): void {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const allNotifications: NotificationData[] = stored ? JSON.parse(stored) : [];
      
      const newNotification: NotificationData = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      
      allNotifications.unshift(newNotification);
      
      // Keep only the last 100 notifications per user to prevent storage bloat
      const userNotifications = allNotifications.filter(n => n.userId === notification.userId);
      const otherNotifications = allNotifications.filter(n => n.userId !== notification.userId);
      const limitedUserNotifications = userNotifications.slice(0, 100);
      
      const finalNotifications = [...limitedUserNotifications, ...otherNotifications];
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(finalNotifications));
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  },

  // Mark notification as read
  markAsRead(notificationId: string): void {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const allNotifications: NotificationData[] = stored ? JSON.parse(stored) : [];
      
      const updatedNotifications = allNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      );
      
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  // Mark all notifications as read for a user
  markAllAsRead(userId: string): void {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const allNotifications: NotificationData[] = stored ? JSON.parse(stored) : [];
      
      const updatedNotifications = allNotifications.map(notification =>
        notification.userId === userId
          ? { ...notification, isRead: true }
          : notification
      );
      
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  // Delete a notification
  deleteNotification(notificationId: string): void {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const allNotifications: NotificationData[] = stored ? JSON.parse(stored) : [];
      
      const filteredNotifications = allNotifications.filter(
        notification => notification.id !== notificationId
      );
      
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(filteredNotifications));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  },

  // Clear all notifications for a user
  clearAllNotifications(userId: string): void {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const allNotifications: NotificationData[] = stored ? JSON.parse(stored) : [];
      
      const filteredNotifications = allNotifications.filter(
        notification => notification.userId !== userId
      );
      
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(filteredNotifications));
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  },

  // Get unread count for a user
  getUnreadCount(userId: string): number {
    const notifications = this.getNotifications(userId);
    return notifications.filter(notification => !notification.isRead).length;
  },

  // Create notification for invoice status changes
  createInvoiceNotification(
    type: 'invoice_approved' | 'invoice_rejected' | 'invoice_paid',
    invoiceId: string,
    freelancerUserId: string,
    amount: string,
    employerEmail: string,
    rejectionReason?: string
  ): void {
    let title = '';
    let message = '';
    let priority: 'low' | 'medium' | 'high' = 'medium';

    switch (type) {
      case 'invoice_approved':
        title = '✅ Invoice Approved';
        message = `Your invoice ${invoiceId} for ${amount} ETH has been approved by ${employerEmail}. Payment is being processed.`;
        priority = 'high';
        break;
      case 'invoice_rejected':
        title = '❌ Invoice Rejected';
        message = `Your invoice ${invoiceId} has been rejected by ${employerEmail}.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`;
        priority = 'high';
        break;
      case 'invoice_paid':
        title = '💰 Payment Received';
        message = `Payment of ${amount} ETH for invoice ${invoiceId} has been completed successfully!`;
        priority = 'high';
        break;
    }

    this.addNotification({
      type,
      title,
      message,
      priority,
      invoiceId,
      userId: freelancerUserId
    });
  },

  // Create notification for new invoice (for employers)
  createNewInvoiceNotification(
    invoiceId: string,
    employerUserId: string,
    freelancerName: string,
    amount: string
  ): void {
    this.addNotification({
      type: 'new_invoice',
      title: '📄 New Invoice Received',
      message: `${freelancerName} has sent you an invoice ${invoiceId} for ${amount} ETH. Please review and approve.`,
      priority: 'high',
      invoiceId,
      userId: employerUserId
    });
  }
};