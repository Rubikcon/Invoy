import { useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';
import { secureAuthService } from '../services/secureAuthService';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });
  const [pendingSocialUser, setPendingSocialUser] = useState<User | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await secureAuthService.getCurrentUser();
        
        if (result.success && result.user) {
          setAuthState({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          // No valid session
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Session check failed'
        });
      }
    };

    checkSession();

    // Listen to auth state changes
    const { data: { subscription } } = secureAuthService.onAuthStateChange((user) => {
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);



  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await secureAuthService.login(credentials);
      
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.message ? result.message : null
        }));
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Login failed. Please try again.'
      }));
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await secureAuthService.register(data);
      
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      }
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: result.message ? result.message : null
      }));
      return false;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Registration failed. Please try again.'
      }));
      return false;
    }
  };

  const logout = async () => {
    await secureAuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'avatar' | 'walletAddress'>>): Promise<boolean> => {
    if (!authState.user) return false;

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // For now, just update local state since Supabase profile updates
      // would require additional setup with user_metadata or profiles table
      const updatedUser = { ...authState.user, ...updates };
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
        error: null
      }));
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Profile update failed. Please try again.'
      }));
      return false;
    }
  };

  const socialLogin = async (provider: 'google' | 'github'): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let result;
      if (provider === 'google') {
        result = await secureAuthService.loginWithGoogle();
      } else {
        result = await secureAuthService.loginWithGitHub();
      }
      
      if (result.success) {
        // OAuth will redirect, so we just need to handle the success case
        setAuthState(prev => ({ ...prev, isLoading: false, error: null }));
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.message ? result.message : null
        }));
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Social login failed. Please try again.'
      }));
      return false;
    }
  };

  const updateUserRole = async (role: 'freelancer' | 'employer'): Promise<boolean> => {
    if (!pendingSocialUser) return false;

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // For now, just update the local state with the selected role
      const updatedUser = { ...pendingSocialUser, role };
      
      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      setPendingSocialUser(null);
      setShowRoleSelection(false);
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update role. Please try again.'
      }));
      return false;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    pendingSocialUser,
    showRoleSelection,
    login,
    register,
    socialLogin,
    updateUserRole,
    logout,
    updateProfile,
    clearError
  };
}