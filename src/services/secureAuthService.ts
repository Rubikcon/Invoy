// Secure authentication service using Supabase Auth
import { User, LoginCredentials, RegisterData } from '../types';
import { authService } from './authService';

export const secureAuthService = {
  // Register new user
  async register(userData: RegisterData): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const response = await authService.register(userData);
      
      if (!response.success) {
        return { success: false, message: response.error || 'Registration failed' };
      }
      
      return { success: true, user: response.user, message: response.message };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const response = await authService.login(credentials);
      
      if (!response.success) {
        return { success: false, message: response.error || 'Login failed' };
      }
      
      return { success: true, user: response.user, message: response.message };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        return { success: false, message: 'No user session found' };
      }
      
      return { success: true, user: currentUser };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return { success: false, message: error.message || 'Failed to get user' };
    }
  },

  // Logout user
  async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      authService.logout();
      return { success: true, message: 'Logged out successfully' };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, message: error.message || 'Logout failed' };
    }
  },

  // Refresh authentication token
  async refreshAuth(): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      // For the local auth service, we don't need token refresh
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        return { success: false, message: 'No user session found' };
      }
      
      return { success: true, user: currentUser };
    } catch (error: any) {
      console.error('Token refresh error:', error);
      return { success: false, message: error.message || 'Token refresh failed' };
    }
  },

  // Check if user is authenticated using API client
  async isAuthenticated(): Promise<boolean> {
    return authService.isSessionValid();
  },

  // Check if session is valid
  async isSessionValid(): Promise<boolean> {
    return authService.isSessionValid();
  }
};