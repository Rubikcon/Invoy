// API client for secure backend communication
import jwtService from './jwtService';
import sessionManager from './sessionManager';

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL + '/functions/v1';

interface ApiResponse<T = any> {
  success: boolean;
  status?: number;
  data?: T;
  user?: any;
  token?: string;
  message?: string;
  error?: string;
}

class ApiClient {
  private token: string | null = null;
  private requestQueue: Array<() => void> = [];
  private isRefreshing = false;

  constructor() {
    // Load token from JWT service on initialization
    this.token = jwtService.getAccessToken();
  }

  setToken(token: string | null) {
    this.token = token;
  }

  // Add request to queue during token refresh
  private addToQueue(callback: () => void): void {
    this.requestQueue.push(callback);
  }

  // Process queued requests after token refresh
  private processQueue(error: any = null): void {
    this.requestQueue.forEach(callback => callback());
    this.requestQueue = [];
    this.isRefreshing = false;
  }

  private async _makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Check if we need to refresh token before making request
    if (this.token && jwtService.shouldRefreshToken(this.token)) {
      await this.handleTokenRefresh();
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Handle 401 responses (token expired/invalid)
      if (response.status === 401 && this.token && !endpoint.includes('/auth/refresh')) {
        const refreshed = await this.handleTokenRefresh();
        if (refreshed) {
          // Retry the original request with new token
          return this._makeRequest(endpoint, options);
        }
      }

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          error: data.error || `HTTP error! status: ${response.status}`
        };
      }

      return {
        ...data,
        status: response.status
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // Handle token refresh with queue management
  private async handleTokenRefresh(): Promise<boolean> {
    if (this.isRefreshing) {
      // If already refreshing, wait for it to complete
      return new Promise((resolve) => {
        this.addToQueue(() => resolve(!!this.token));
      });
    }

    this.isRefreshing = true;

    try {
      const refreshed = await sessionManager.refreshTokenIfNeeded();
      this.token = jwtService.getAccessToken();
      this.processQueue();
      return refreshed;
    } catch (error) {
      this.processQueue(error);
      return false;
    }
  }

  // Authentication endpoints
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'freelancer' | 'employer';
  }): Promise<ApiResponse> {
    const response = await this._makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse> {
    const response = await this._makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this._makeRequest('/auth/logout', {
      method: 'POST',
    });

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this._makeRequest('/auth/me', {
      method: 'GET',
    });
  }

  async updateProfile(updates: {
    name?: string;
    avatar?: string;
    wallet_address?: string;
  }): Promise<ApiResponse> {
    return this._makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async refreshToken(): Promise<ApiResponse> {
    const refreshToken = jwtService.getRefreshToken();
    if (!refreshToken) {
      return { success: false, error: 'No refresh token available' };
    }

    const response = await this._makeRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    return response;
  }

  // OAuth endpoints
  async googleOAuth(code: string, redirectUri: string, role?: string): Promise<ApiResponse> {
    const response = await this._makeRequest('/oauth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ code, redirect_uri: redirectUri, role }),
    });

    return response;
  }

  async githubOAuth(code: string, role?: string): Promise<ApiResponse> {
    const response = await this._makeRequest('/oauth/github/callback', {
      method: 'POST',
      body: JSON.stringify({ code, role }),
    });

    return response;
  }

  // Get current token info
  getTokenInfo(): { isValid: boolean; expiresIn: number | null; user: any | null } {
    if (!this.token) {
      return { isValid: false, expiresIn: null, user: null };
    }

    const isValid = !jwtService.isTokenExpired(this.token);
    const user = jwtService.getUserFromToken(this.token);
    const payload = jwtService.decodeToken(this.token);
    const expiresIn = payload ? (payload.exp * 1000 - Date.now()) : null;

    return { isValid, expiresIn, user };
  }

  // Generic request method for other services
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<any> {
    return this._makeRequest(endpoint, options);
  }
}

export const apiClient = new ApiClient();
export default apiClient;