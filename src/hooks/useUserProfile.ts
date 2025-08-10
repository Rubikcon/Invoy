import { useState, useEffect } from 'react';
import { UserProfile, UserWallet, UserPreferences } from '../types';
import { userProfileService } from '../services/userProfileService';
import { userPreferencesService } from '../services/userPreferencesService';

export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile data
  useEffect(() => {
    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      // Load profile
      const userProfile = userProfileService.getUserProfile(userId);
      setProfile(userProfile);

      // Load wallets
      const userWallets = userProfileService.getUserWallets(userId);
      setWallets(userWallets);

      // Load preferences
      const userPreferences = userPreferencesService.getUserPreferences(userId);
      setPreferences(userPreferences);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return false;

    try {
      const result = await userProfileService.updateProfile(userId, updates);
      if (result.success && result.profile) {
        setProfile(result.profile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!userId) return false;

    try {
      const result = await userPreferencesService.updatePreferences(userId, updates);
      if (result.success && result.preferences) {
        setPreferences(result.preferences);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  };

  const addWallet = async (walletAddress: string, network: string, label?: string) => {
    if (!userId) return false;

    try {
      const result = await userProfileService.addWalletWithConsent(
        userId,
        walletAddress,
        network,
        label
      );
      
      if (result.success) {
        const updatedWallets = userProfileService.getUserWallets(userId);
        setWallets(updatedWallets);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding wallet:', error);
      return false;
    }
  };

  const removeWallet = async (walletId: string) => {
    if (!userId) return false;

    try {
      const result = await userProfileService.removeWallet(userId, walletId);
      if (result.success) {
        const updatedWallets = userProfileService.getUserWallets(userId);
        setWallets(updatedWallets);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing wallet:', error);
      return false;
    }
  };

  const setPrimaryWallet = async (walletId: string) => {
    if (!userId) return false;

    try {
      const result = await userProfileService.setPrimaryWallet(userId, walletId);
      if (result.success) {
        const updatedWallets = userProfileService.getUserWallets(userId);
        setWallets(updatedWallets);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error setting primary wallet:', error);
      return false;
    }
  };

  const getPrimaryWallet = (): UserWallet | null => {
    return wallets.find(wallet => wallet.isPrimary) || wallets[0] || null;
  };

  const refreshData = () => {
    loadProfileData();
  };

  return {
    profile,
    wallets,
    preferences,
    isLoading,
    updateProfile,
    updatePreferences,
    addWallet,
    removeWallet,
    setPrimaryWallet,
    getPrimaryWallet,
    refreshData
  };
}