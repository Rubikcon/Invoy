// Secure authentication service using Supabase Auth
import { User, LoginCredentials, RegisterData } from '../types';
import { apiClient } from './apiClient';

export const secureAuthService = {
  // Register new user
  async register(userData: RegisterData): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const response = await apiClient.register(userData);
      
      if (!response.success) {
        return { success: false, message: response.error || 'Registration failed' };
      }
      
      if (response.user) {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: userData.name,
          role: userData.role,
          createdAt: new Date(response.user.created_at || Date.now()),
          isEmailVerified: response.user.email_verified || false
        };
        
        return { success: true, user, message: 'Registration successful' };
      }
      
      return { success: false, message: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const response = await apiClient.login(credentials);
      
      if (!response.success) {
        return { success: false, message: response.error || 'Login failed' };
      }
      
      if (response.user) {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name || response.user.email,
          role: response.user.role || 'freelancer',
          createdAt: new Date(response.user.created_at || Date.now()),
          isEmailVerified: response.user.email_verified || false
        };
        
        return { success: true, user, message: 'Login successful' };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const response = await apiClient.getCurrentUser();
      
      if (!response.success) {
        return { success: false, message: response.error || 'Failed to get user' };
      }
      
      if (response.user) {
        const currentUser: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name || response.user.email,
          role: response.user.role || 'freelancer',
          createdAt: new Date(response.user.created_at || Date.now()),
          isEmailVerified: response.user.email_verified || false
        };
        
        return { success: true, user: currentUser };
      }
      
      return { success: false, message: 'No user found' };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return { success: false, message: error.message || 'Failed to get user' };
    }
  },

  // Logout user
  async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.logout();
      
      if (!response.success) {
        return { success: false, message: response.error || 'Logout failed' };
      }
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, message: error.message || 'Logout failed' };
    }
  },

  // Refresh authentication token
  async refreshAuth(): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const response = await apiClient.refreshToken();
      
      if (!response.success) {
        return { success: false, message: response.error || 'Token refresh failed' };
      }
      
      if (response.user) {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name || response.user.email,
          role: response.user.role || 'freelancer',
          createdAt: new Date(response.user.created_at || Date.now()),
          isEmailVerified: response.user.email_verified || false
        };
        
        return { success: true, user };
      }
      
      return { success: false, message: 'Token refresh failed' };
    } catch (error: any) {
      console.error('Token refresh error:', error);
      return { success: false, message: error.message || 'Token refresh failed' };
    }
  },

  // Check if user is authenticated using API client
  async isAuthenticated(): Promise<boolean> {
    const tokenInfo = apiClient.getTokenInfo();
    return tokenInfo.isValid;
  }
};