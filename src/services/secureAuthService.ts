// Secure authentication service using Supabase Auth
import { User, LoginCredentials, RegisterData } from '../types';
import { supabase } from './supabaseClient';

export const secureAuthService = {
  // Register new user
  async register(userData: RegisterData): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            role: userData.role
          }
        }
      });
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name: userData.name,
          role: userData.role,
          createdAt: new Date(data.user.created_at),
          isEmailVerified: data.user.email_confirmed_at !== null
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name || data.user.email!,
          role: data.user.user_metadata?.role || 'freelancer',
          createdAt: new Date(data.user.created_at),
          isEmailVerified: data.user.email_confirmed_at !== null
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
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      if (user) {
        const currentUser: User = {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!,
          role: user.user_metadata?.role || 'freelancer',
          createdAt: new Date(user.created_at),
          isEmailVerified: user.email_confirmed_at !== null
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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, message: error.message };
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
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name || data.user.email!,
          role: data.user.user_metadata?.role || 'freelancer',
          createdAt: new Date(data.user.created_at),
          isEmailVerified: data.user.email_confirmed_at !== null
        };
        
        return { success: true, user };
      }
      
      return { success: false, message: 'Token refresh failed' };
    } catch (error: any) {
      console.error('Token refresh error:', error);
      return { success: false, message: error.message || 'Token refresh failed' };
    }
  },

  // Social login (Google)
  async loginWithGoogle(): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      // OAuth redirect will handle the rest
      return { success: true, message: 'Redirecting to Google...' };
    } catch (error: any) {
      console.error('Google login error:', error);
      return { success: false, message: error.message || 'Google login failed' };
    }
  },

  // Social login (GitHub)
  async loginWithGitHub(): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      // OAuth redirect will handle the rest
      return { success: true, message: 'Redirecting to GitHub...' };
    } catch (error: any) {
      console.error('GitHub login error:', error);
      return { success: false, message: error.message || 'GitHub login failed' };
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return !!user;
    } catch {
      return false;
    }
  },

  // Get current user from session (without API call)
  async getCurrentUserFromSession(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        return {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!,
          role: user.user_metadata?.role || 'freelancer',
          createdAt: new Date(user.created_at),
          isEmailVerified: user.email_confirmed_at !== null
        };
      }
      
      return null;
    } catch {
      return null;
    }
  },

  // Check session validity
  async isSessionValid(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch {
      return false;
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || session.user.email!,
          role: session.user.user_metadata?.role || 'freelancer',
          createdAt: new Date(session.user.created_at),
          isEmailVerified: session.user.email_confirmed_at !== null
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }
};