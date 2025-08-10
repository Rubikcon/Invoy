// Secure authentication service using backend APIs
import { User, LoginCredentials, RegisterData } from '../types';
import apiClient from './apiClient';

export const secureAuthService = {
  // Register new user
  async register(data: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await apiClient.register(data);
      
      if (response.success && response.user) {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          avatar: response.user.avatar,
          createdAt: new Date(response.user.created_at),
          lastLoginAt: response.user.last_login_at ? new Date(response.user.last_login_at) : undefined,
          isEmailVerified: response.user.email_verified,
          walletAddress: response.user.wallet_address
        };

        return { success: true, message: response.message || 'Registration successful', user };
      }

      return { success: false, message: response.error || 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed. Please try again.' };
    }
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await apiClient.login(credentials);
      
      if (response.success && response.user) {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          avatar: response.user.avatar,
          createdAt: new Date(response.user.created_at),
          lastLoginAt: response.user.last_login_at ? new Date(response.user.last_login_at) : undefined,
          isEmailVerified: response.user.email_verified,
          walletAddress: response.user.wallet_address
        };

        return { success: true, message: response.message || 'Login successful', user };
      }

      return { success: false, message: response.error || 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed. Please try again.' };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.getCurrentUser();
      
      // Handle 401 (unauthorized) as expected behavior for unauthenticated users
      if (response.status === 401) {
        return null;
      }
      
      if (response.success && response.user) {
        return {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          avatar: response.user.avatar,
          createdAt: new Date(response.user.created_at),
          lastLoginAt: response.user.last_login_at ? new Date(response.user.last_login_at) : undefined,
          isEmailVerified: response.user.email_verified,
          walletAddress: response.user.wallet_address
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Update user profile
  async updateProfile(updates: Partial<Pick<User, 'name' | 'avatar' | 'walletAddress'>>): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const profileUpdates: any = {};
      if (updates.name) profileUpdates.name = updates.name;
      if (updates.avatar) profileUpdates.avatar = updates.avatar;
      if (updates.walletAddress) profileUpdates.wallet_address = updates.walletAddress;

      const response = await apiClient.updateProfile(profileUpdates);
      
      if (response.success && response.user) {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          avatar: response.user.avatar,
          createdAt: new Date(response.user.created_at),
          lastLoginAt: response.user.last_login_at ? new Date(response.user.last_login_at) : undefined,
          isEmailVerified: response.user.email_verified,
          walletAddress: response.user.wallet_address
        };

        return { success: true, message: response.message || 'Profile updated successfully', user };
      }

      return { success: false, message: response.error || 'Failed to update profile' };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { success: false, message: error.message || 'Failed to update profile' };
    }
  },

  // Social authentication
  async socialLogin(provider: 'google' | 'github', code: string, role?: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      let response;
      
      if (provider === 'google') {
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        response = await apiClient.googleOAuth(code, redirectUri, role);
      } else {
        response = await apiClient.githubOAuth(code, role);
      }
      
      if (response.success && response.user) {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          avatar: response.user.avatar,
          createdAt: new Date(response.user.created_at),
          lastLoginAt: response.user.last_login_at ? new Date(response.user.last_login_at) : undefined,
          isEmailVerified: response.user.email_verified,
          walletAddress: response.user.wallet_address
        };

        return { success: true, message: response.message || 'Social login successful', user };
      }

      return { success: false, message: response.error || 'Social login failed' };
    } catch (error: any) {
      console.error('Social login error:', error);
      return { success: false, message: error.message || 'Social login failed. Please try again.' };
    }
  },

  // Check if session is valid
  async isSessionValid(): Promise<boolean> {
    try {
      const response = await apiClient.getCurrentUser();
      // 401 means unauthenticated, which is expected - not an error
      if (response.status === 401) {
        return false;
      }
      return response.success;
    } catch (error) {
      return false;
    }
  }
};