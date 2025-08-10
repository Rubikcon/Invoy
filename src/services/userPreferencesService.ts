// User Preferences Service for managing user settings and preferences
import { UserPreferences } from '../types';

export interface PreferencesUpdate {
  preferredNetwork?: string;
  preferredCurrency?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  invoiceNotifications?: boolean;
  paymentNotifications?: boolean;
  marketingEmails?: boolean;
  securityAlerts?: boolean;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  dateFormat?: string;
  currencyDisplay?: 'symbol' | 'code' | 'name';
}

class UserPreferencesService {
  private readonly STORAGE_KEY = 'invoy_user_preferences';

  // Get user preferences
  getUserPreferences(userId: string): UserPreferences {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
      if (stored) {
        const preferences = JSON.parse(stored);
        return {
          ...preferences,
          createdAt: new Date(preferences.createdAt),
          updatedAt: new Date(preferences.updatedAt)
        };
      }
      
      // Return default preferences
      return this.getDefaultPreferences(userId);
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return this.getDefaultPreferences(userId);
    }
  }

  // Get default preferences
  private getDefaultPreferences(userId: string): UserPreferences {
    return {
      id: `pref_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      userId,
      preferredNetwork: 'ethereum',
      preferredCurrency: 'ETH',
      emailNotifications: true,
      pushNotifications: true,
      invoiceNotifications: true,
      paymentNotifications: true,
      marketingEmails: false,
      securityAlerts: true,
      theme: 'system',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      dateFormat: 'MM/DD/YYYY',
      currencyDisplay: 'symbol',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Update user preferences
  async updatePreferences(
    userId: string, 
    updates: PreferencesUpdate
  ): Promise<{ success: boolean; message: string; preferences?: UserPreferences }> {
    try {
      const currentPreferences = this.getUserPreferences(userId);
      
      const updatedPreferences: UserPreferences = {
        ...currentPreferences,
        ...updates,
        updatedAt: new Date()
      };

      // Validate preferences
      const validation = this.validatePreferences(updatedPreferences);
      if (!validation.isValid) {
        return { success: false, message: validation.message };
      }

      // Store preferences
      const storageData = {
        ...updatedPreferences,
        createdAt: updatedPreferences.createdAt.toISOString(),
        updatedAt: updatedPreferences.updatedAt.toISOString()
      };

      localStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(storageData));

      return { 
        success: true, 
        message: 'Preferences updated successfully',
        preferences: updatedPreferences
      };
    } catch (error) {
      console.error('Error updating preferences:', error);
      return { success: false, message: 'Failed to update preferences' };
    }
  }

  // Validate preferences
  private validatePreferences(preferences: UserPreferences): { isValid: boolean; message: string } {
    const validNetworks = ['ethereum', 'polygon', 'arbitrum', 'optimism', 'base'];
    const validCurrencies = ['ETH', 'USDC', 'USDT', 'DAI', 'MATIC', 'ARB'];
    const validThemes = ['light', 'dark', 'system'];
    const validCurrencyDisplays = ['symbol', 'code', 'name'];

    if (!validNetworks.includes(preferences.preferredNetwork)) {
      return { isValid: false, message: 'Invalid preferred network' };
    }

    if (!validCurrencies.includes(preferences.preferredCurrency)) {
      return { isValid: false, message: 'Invalid preferred currency' };
    }

    if (!validThemes.includes(preferences.theme)) {
      return { isValid: false, message: 'Invalid theme selection' };
    }

    if (!validCurrencyDisplays.includes(preferences.currencyDisplay)) {
      return { isValid: false, message: 'Invalid currency display format' };
    }

    return { isValid: true, message: 'Valid preferences' };
  }

  // Reset preferences to defaults
  async resetToDefaults(userId: string): Promise<{ success: boolean; message: string; preferences?: UserPreferences }> {
    try {
      const defaultPreferences = this.getDefaultPreferences(userId);
      
      const storageData = {
        ...defaultPreferences,
        createdAt: defaultPreferences.createdAt.toISOString(),
        updatedAt: defaultPreferences.updatedAt.toISOString()
      };

      localStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(storageData));

      return { 
        success: true, 
        message: 'Preferences reset to defaults',
        preferences: defaultPreferences
      };
    } catch (error) {
      console.error('Error resetting preferences:', error);
      return { success: false, message: 'Failed to reset preferences' };
    }
  }

  // Export preferences
  exportPreferences(userId: string): string {
    const preferences = this.getUserPreferences(userId);
    return JSON.stringify(preferences, null, 2);
  }

  // Import preferences
  async importPreferences(userId: string, preferencesJson: string): Promise<{ success: boolean; message: string }> {
    try {
      const importedPreferences = JSON.parse(preferencesJson);
      
      // Validate imported data
      const validation = this.validatePreferences(importedPreferences);
      if (!validation.isValid) {
        return { success: false, message: `Invalid preferences data: ${validation.message}` };
      }

      // Update with imported preferences
      const result = await this.updatePreferences(userId, importedPreferences);
      return result;
    } catch (error) {
      return { success: false, message: 'Invalid JSON format' };
    }
  }

  // Get notification preferences
  getNotificationPreferences(userId: string): {
    emailNotifications: boolean;
    pushNotifications: boolean;
    invoiceNotifications: boolean;
    paymentNotifications: boolean;
    marketingEmails: boolean;
    securityAlerts: boolean;
  } {
    const preferences = this.getUserPreferences(userId);
    return {
      emailNotifications: preferences.emailNotifications,
      pushNotifications: preferences.pushNotifications,
      invoiceNotifications: preferences.invoiceNotifications,
      paymentNotifications: preferences.paymentNotifications,
      marketingEmails: preferences.marketingEmails,
      securityAlerts: preferences.securityAlerts
    };
  }

  // Update notification preferences
  async updateNotificationPreferences(
    userId: string,
    notifications: Partial<{
      emailNotifications: boolean;
      pushNotifications: boolean;
      invoiceNotifications: boolean;
      paymentNotifications: boolean;
      marketingEmails: boolean;
      securityAlerts: boolean;
    }>
  ): Promise<{ success: boolean; message: string }> {
    return this.updatePreferences(userId, notifications);
  }
}

export const userPreferencesService = new UserPreferencesService();
export default userPreferencesService;