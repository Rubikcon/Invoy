// API client for secure backend communication
const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL + '/functions/v1';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: any;
  token?: string;
  message?: string;
  error?: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'freelancer' | 'employer';
  }): Promise<ApiResponse> {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    this.setToken(null);
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  async updateProfile(updates: {
    name?: string;
    avatar?: string;
    wallet_address?: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async refreshToken(): Promise<ApiResponse> {
    const response = await this.request('/auth/refresh', {
      method: 'POST',
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // OAuth endpoints
  async googleOAuth(code: string, redirectUri: string, role?: string): Promise<ApiResponse> {
    const response = await this.request('/oauth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ code, redirect_uri: redirectUri, role }),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async githubOAuth(code: string, role?: string): Promise<ApiResponse> {
    const response = await this.request('/oauth/github/callback', {
      method: 'POST',
      body: JSON.stringify({ code, role }),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }
}

export const apiClient = new ApiClient();
export default apiClient;