// Session Manager for handling authentication state and token lifecycle
import jwtService from './jwtService';
import apiClient from './apiClient';

interface SessionState {
  isAuthenticated: boolean;
  user: any | null;
  tokenExpiry: number | null;
  lastActivity: number;
}

class SessionManager {
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity
  private readonly ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check every minute
  private sessionState: SessionState = {
    isAuthenticated: false,
    user: null,
    tokenExpiry: null,
    lastActivity: Date.now()
  };
  private activityTimer: NodeJS.Timeout | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.initializeSession();
    this.startActivityMonitoring();
    this.setupEventListeners();
  }

  // Initialize session from stored tokens
  private initializeSession(): void {
    const accessToken = jwtService.getAccessToken();
    if (accessToken && jwtService.isValidTokenFormat(accessToken)) {
      if (!jwtService.isTokenExpired(accessToken)) {
        const user = jwtService.getUserFromToken(accessToken);
        if (user) {
          this.sessionState = {
            isAuthenticated: true,
            user,
            tokenExpiry: jwtService.decodeToken(accessToken)?.exp || null,
            lastActivity: Date.now()
          };
        }
      } else {
        // Token expired, try to refresh
        this.refreshTokenIfNeeded();
      }
    }
  }

  // Start monitoring user activity
  private startActivityMonitoring(): void {
    this.activityTimer = setInterval(() => {
      this.checkSessionTimeout();
    }, this.ACTIVITY_CHECK_INTERVAL);
  }

  // Setup event listeners for user activity
  private setupEventListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, this.updateActivity.bind(this), true);
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateActivity();
        this.refreshTokenIfNeeded();
      }
    });

    // Handle storage changes (for multi-tab sync)
    window.addEventListener('storage', (e) => {
      if (e.key === 'invoy_access_token') {
        if (!e.newValue) {
          // Token was removed in another tab
          this.clearSession();
        } else {
          // Token was updated in another tab
          this.initializeSession();
        }
      }
    });
  }

  // Update last activity timestamp
  private updateActivity(): void {
    this.sessionState.lastActivity = Date.now();
  }

  // Check if session has timed out due to inactivity
  private checkSessionTimeout(): void {
    if (!this.sessionState.isAuthenticated) return;

    const now = Date.now();
    const timeSinceActivity = now - this.sessionState.lastActivity;

    if (timeSinceActivity > this.SESSION_TIMEOUT) {
      console.log('Session timed out due to inactivity');
      this.clearSession();
      // Optionally notify user about timeout
      this.notifySessionTimeout();
    }
  }

  // Notify user about session timeout
  private notifySessionTimeout(): void {
    // You can customize this notification
    if (window.confirm('Your session has expired due to inactivity. Would you like to log in again?')) {
      window.location.reload();
    }
  }

  // Set session after successful authentication
  setSession(accessToken: string, refreshToken?: string, user?: any): void {
    jwtService.setTokens(accessToken, refreshToken);
    
    const tokenUser = jwtService.getUserFromToken(accessToken);
    const tokenPayload = jwtService.decodeToken(accessToken);
    
    this.sessionState = {
      isAuthenticated: true,
      user: user || tokenUser,
      tokenExpiry: tokenPayload?.exp || null,
      lastActivity: Date.now()
    };

    // Set token in API client
    apiClient.setToken(accessToken);
  }

  // Clear session
  clearSession(): void {
    jwtService.clearTokens();
    apiClient.setToken(null);
    
    this.sessionState = {
      isAuthenticated: false,
      user: null,
      tokenExpiry: null,
      lastActivity: Date.now()
    };
  }

  // Get current session state
  getSessionState(): SessionState {
    return { ...this.sessionState };
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.sessionState.isAuthenticated;
  }

  // Get current user
  getCurrentUser(): any | null {
    return this.sessionState.user;
  }

  // Refresh token if needed
  async refreshTokenIfNeeded(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const accessToken = jwtService.getAccessToken();
    const refreshToken = jwtService.getRefreshToken();

    if (!accessToken || !refreshToken) {
      this.clearSession();
      return false;
    }

    // Check if token needs refresh
    if (!jwtService.shouldRefreshToken(accessToken) && !jwtService.isTokenExpired(accessToken)) {
      return true;
    }

    this.refreshPromise = this.performTokenRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    
    return result;
  }

  // Perform actual token refresh
  private async performTokenRefresh(): Promise<boolean> {
    try {
      const response = await apiClient.refreshToken();
      
      if (response.success && response.token) {
        const user = jwtService.getUserFromToken(response.token);
        this.setSession(response.token, undefined, user);
        return true;
      } else {
        console.error('Token refresh failed:', response.error);
        this.clearSession();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearSession();
      return false;
    }
  }

  // Validate current session
  async validateSession(): Promise<boolean> {
    if (!this.sessionState.isAuthenticated) {
      return false;
    }

    const accessToken = jwtService.getAccessToken();
    if (!accessToken) {
      this.clearSession();
      return false;
    }

    // If token is expired, try to refresh
    if (jwtService.isTokenExpired(accessToken)) {
      return await this.refreshTokenIfNeeded();
    }

    // If token needs refresh soon, refresh it proactively
    if (jwtService.shouldRefreshToken(accessToken)) {
      this.refreshTokenIfNeeded(); // Don't wait for this
    }

    return true;
  }

  // Get time until token expires
  getTimeUntilExpiry(): number | null {
    if (!this.sessionState.tokenExpiry) return null;
    
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = this.sessionState.tokenExpiry - now;
    
    return Math.max(0, timeLeft * 1000); // Return in milliseconds
  }

  // Cleanup resources
  destroy(): void {
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = null;
    }

    // Remove event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.removeEventListener(event, this.updateActivity.bind(this), true);
    });
  }
}

export const sessionManager = new SessionManager();
export default sessionManager;