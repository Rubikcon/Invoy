import { useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';
import { authService } from '../services/authService';
import { socialAuthService } from '../services/socialAuthService';

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
    const checkSession = () => {
      try {
        if (authService.isSessionValid()) {
          const user = authService.getCurrentUser();
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

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await authService.login(credentials);
      
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
      const result = await authService.register(data);
      
      if (result.success && result.user) {
        // Auto-login after successful registration
        const loginResult = await authService.login({
          email: data.email,
          password: data.password
        });
        
        if (loginResult.success && loginResult.user) {
          setAuthState({
            user: loginResult.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return true;
        }
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
    authService.logout();
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
      const result = await authService.updateProfile(authState.user.id, updates);
      
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
      const result = provider === 'google' 
        ? await socialAuthService.signInWithGoogle()
        : await socialAuthService.signInWithGitHub();
      
      if (result.success && result.user) {
        // Create session
        const session = {
          userId: result.user.id,
          email: result.user.email,
          role: result.user.role,
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('invoy_session', JSON.stringify(session));
        localStorage.setItem('invoy_current_user', JSON.stringify({
          ...result.user,
          createdAt: result.user.createdAt.toISOString(),
          lastLoginAt: new Date().toISOString()
        }));

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
      const result = await socialAuthService.updateUserRole(pendingSocialUser.id, role);
      
      if (result.success && result.user) {
        // Create session
        const session = {
          userId: result.user.id,
          email: result.user.email,
          role: result.user.role,
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('invoy_session', JSON.stringify(session));
        localStorage.setItem('invoy_current_user', JSON.stringify({
          ...result.user,
          createdAt: result.user.createdAt.toISOString(),
          lastLoginAt: new Date().toISOString()
        }));

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