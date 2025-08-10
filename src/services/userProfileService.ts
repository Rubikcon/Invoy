// User Profile Service for managing extended user profile information
import { UserProfile, UserWallet } from '../types';
import walletAuthService from './walletAuthService';

export interface ProfileUpdate {
  bio?: string;
  location?: string;
  website?: string;
  timezone?: string;
  profileVisibility?: 'public' | 'private' | 'contacts';
}

class UserProfileService {
  private readonly PROFILES_STORAGE_KEY = 'invoy_user_profiles';
  private readonly WALLETS_STORAGE_KEY = 'invoy_user_wallets';

  // Get user profile
  getUserProfile(userId: string): UserProfile {
    try {
      const stored = localStorage.getItem(`${this.PROFILES_STORAGE_KEY}_${userId}`);
      if (stored) {
        const profile = JSON.parse(stored);
        return {
          ...profile,
          createdAt: new Date(profile.createdAt),
          updatedAt: new Date(profile.updatedAt)
        };
      }
      
      // Return default profile
      return this.getDefaultProfile(userId);
    } catch (error) {
      console.error('Error loading user profile:', error);
      return this.getDefaultProfile(userId);
    }
  }

  // Get default profile
  private getDefaultProfile(userId: string): UserProfile {
    return {
      id: `profile_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      userId,
      bio: '',
      location: '',
      website: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      profileVisibility: 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Update user profile
  async updateProfile(
    userId: string, 
    updates: ProfileUpdate
  ): Promise<{ success: boolean; message: string; profile?: UserProfile }> {
    try {
      const currentProfile = this.getUserProfile(userId);
      
      const updatedProfile: UserProfile = {
        ...currentProfile,
        ...updates,
        updatedAt: new Date()
      };

      // Validate profile data
      const validation = this.validateProfile(updatedProfile);
      if (!validation.isValid) {
        return { success: false, message: validation.message };
      }

      // Store profile
      const storageData = {
        ...updatedProfile,
        createdAt: updatedProfile.createdAt.toISOString(),
        updatedAt: updatedProfile.updatedAt.toISOString()
      };

      localStorage.setItem(`${this.PROFILES_STORAGE_KEY}_${userId}`, JSON.stringify(storageData));

      return { 
        success: true, 
        message: 'Profile updated successfully',
        profile: updatedProfile
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  }

  // Validate profile data
  private validateProfile(profile: UserProfile): { isValid: boolean; message: string } {
    if (profile.website && !this.isValidUrl(profile.website)) {
      return { isValid: false, message: 'Invalid website URL' };
    }

    if (profile.bio && profile.bio.length > 500) {
      return { isValid: false, message: 'Bio must be less than 500 characters' };
    }

    if (profile.location && profile.location.length > 100) {
      return { isValid: false, message: 'Location must be less than 100 characters' };
    }

    const validVisibilities = ['public', 'private', 'contacts'];
    if (!validVisibilities.includes(profile.profileVisibility)) {
      return { isValid: false, message: 'Invalid profile visibility setting' };
    }

    return { isValid: true, message: 'Valid profile' };
  }

  // Validate URL format
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Get user wallets
  getUserWallets(userId: string): UserWallet[] {
    try {
      const stored = localStorage.getItem(this.WALLETS_STORAGE_KEY);
      if (stored) {
        const allWallets = JSON.parse(stored);
        return allWallets
          .filter((wallet: any) => wallet.userId === userId)
          .map((wallet: any) => ({
            ...wallet,
            createdAt: new Date(wallet.createdAt),
            updatedAt: new Date(wallet.updatedAt),
            consentDate: wallet.consentDate ? new Date(wallet.consentDate) : undefined,
            verificationDate: wallet.verificationDate ? new Date(wallet.verificationDate) : undefined
          }));
      }
      return [];
    } catch (error) {
      console.error('Error loading user wallets:', error);
      return [];
    }
  }

  // Add wallet with consent
  async addWalletWithConsent(
    userId: string,
    walletAddress: string,
    network: string,
    label?: string
  ): Promise<{ success: boolean; message: string; wallet?: UserWallet }> {
    try {
      // Request wallet signature for verification
      const authResult = await walletAuthService.authenticateWithWallet(walletAddress);
      
      if (!authResult.success) {
        return { success: false, message: authResult.message };
      }

      // Store wallet with consent
      const result = await walletAuthService.storeWalletWithConsent(
        userId,
        walletAddress,
        network
      );

      if (result.success) {
        // Get the stored wallet
        const wallets = this.getUserWallets(userId);
        const newWallet = wallets.find(w => 
          w.walletAddress.toLowerCase() === walletAddress.toLowerCase() && 
          w.network === network
        );

        return { 
          success: true, 
          message: 'Wallet added and verified successfully',
          wallet: newWallet
        };
      }

      return result;
    } catch (error: any) {
      console.error('Error adding wallet:', error);
      return { success: false, message: error.message || 'Failed to add wallet' };
    }
  }

  // Remove wallet
  async removeWallet(userId: string, walletId: string): Promise<{ success: boolean; message: string }> {
    try {
      const stored = localStorage.getItem(this.WALLETS_STORAGE_KEY);
      if (stored) {
        const allWallets = JSON.parse(stored);
        const filteredWallets = allWallets.filter((wallet: any) => 
          !(wallet.userId === userId && wallet.id === walletId)
        );
        localStorage.setItem(this.WALLETS_STORAGE_KEY, JSON.stringify(filteredWallets));
      }

      return { success: true, message: 'Wallet removed successfully' };
    } catch (error) {
      console.error('Error removing wallet:', error);
      return { success: false, message: 'Failed to remove wallet' };
    }
  }

  // Set primary wallet
  async setPrimaryWallet(userId: string, walletId: string): Promise<{ success: boolean; message: string }> {
    try {
      const stored = localStorage.getItem(this.WALLETS_STORAGE_KEY);
      if (stored) {
        const allWallets = JSON.parse(stored);
        const updatedWallets = allWallets.map((wallet: any) => {
          if (wallet.userId === userId) {
            return {
              ...wallet,
              isPrimary: wallet.id === walletId,
              updatedAt: new Date().toISOString()
            };
          }
          return wallet;
        });
        localStorage.setItem(this.WALLETS_STORAGE_KEY, JSON.stringify(updatedWallets));
      }

      return { success: true, message: 'Primary wallet updated successfully' };
    } catch (error) {
      console.error('Error setting primary wallet:', error);
      return { success: false, message: 'Failed to update primary wallet' };
    }
  }

  // Get primary wallet
  getPrimaryWallet(userId: string): UserWallet | null {
    const wallets = this.getUserWallets(userId);
    return wallets.find(wallet => wallet.isPrimary) || wallets[0] || null;
  }

  // Verify wallet ownership
  async verifyWalletOwnership(
    userId: string, 
    walletAddress: string
  ): Promise<{ success: boolean; message: string; isVerified?: boolean }> {
    try {
      const authResult = await walletAuthService.authenticateWithWallet(walletAddress);
      
      if (authResult.success) {
        // Update wallet verification status
        const stored = localStorage.getItem(this.WALLETS_STORAGE_KEY);
        if (stored) {
          const allWallets = JSON.parse(stored);
          const updatedWallets = allWallets.map((wallet: any) => {
            if (wallet.userId === userId && wallet.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
              return {
                ...wallet,
                isVerified: true,
                verificationDate: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
            }
            return wallet;
          });
          localStorage.setItem(this.WALLETS_STORAGE_KEY, JSON.stringify(updatedWallets));
        }

        return { 
          success: true, 
          message: 'Wallet ownership verified successfully',
          isVerified: true
        };
      }

      return { success: false, message: authResult.message };
    } catch (error: any) {
      console.error('Error verifying wallet ownership:', error);
      return { success: false, message: error.message || 'Failed to verify wallet ownership' };
    }
  }

  // Get wallet by address
  getWalletByAddress(userId: string, walletAddress: string): UserWallet | null {
    const wallets = this.getUserWallets(userId);
    return wallets.find(wallet => 
      wallet.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    ) || null;
  }

  // Check if wallet is verified
  isWalletVerified(userId: string, walletAddress: string): boolean {
    const wallet = this.getWalletByAddress(userId, walletAddress);
    return wallet?.isVerified || false;
  }
}

export const userProfileService = new UserProfileService();
export default userProfileService;