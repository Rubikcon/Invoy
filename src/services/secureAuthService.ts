// Secure authentication service using Supabase Auth
export const secureAuthService = {
  async getCurrentUser() {
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

  async register(userData: any) {
    try {
      const response = await authService.register(userData);
      return { success: true, user: response };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  },

  async logout() {
    try {
      await authService.logout();
      return { success: true, message: 'Logged out successfully' };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, message: error.message || 'Logout failed' };
    }
  },

  // Refresh authentication token
  async refreshToken() {
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

  // Validate current session
  async validateSession() {
    return authService.isSessionValid();
  },

  // Check if session is valid
  async isSessionValid(): Promise<boolean> {
    return authService.isSessionValid();
  }
};