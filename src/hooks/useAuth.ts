import { useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';
import { secureAuthService } from '../services/secureAuthService';
import sessionManager from '../services/sessionManager';

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
        const sessionInfo = secureAuthService.getSessionInfo();
        
        if (sessionInfo.isAuthenticated && sessionInfo.user) {
          setAuthState({
            user: sessionInfo.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          // Try to validate session with backend
          const isValid = await secureAuthService.isSessionValid();
          if (isValid) {
            const user = await secureAuthService.getCurrentUser();
            if (user) {
              setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null
              });
              return;
            }
          }
          
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
  }, []);

  // Listen for session changes
  useEffect(() => {
    const handleSessionChange = () => {
      const sessionInfo = secureAuthService.getSessionInfo();
      
      if (!sessionInfo.isAuthenticated) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    };

    // Listen for storage changes (multi-tab sync)
    window.addEventListener('storage', handleSessionChange);
    
    return () => {
      window.removeEventListener('storage', handleSessionChange);
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
          error: result.message
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
        error: result.message
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

  const logout = () => {
    secureAuthService.logout(); // This will also clear the session
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
      const result = await secureAuthService.updateProfile(updates);
      
      if (result.success && result.user) {
        setAuthState(prev => ({
          ...prev,
          user: result.user,
          isLoading: false,
          error: null
        }));
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.message
        }));
        return false;
      }
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
      // For demo purposes, simulate OAuth flow
      const mockCode = 'mock_oauth_code_' + Date.now();
      const result = await secureAuthService.socialLogin(provider, mockCode);
      
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
          error: result.message
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
      const result = await secureAuthService.updateProfile({ role } as any);
      
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        setPendingSocialUser(null);
        setShowRoleSelection(false);
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.message
        }));
        return false;
      }
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