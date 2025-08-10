// JWT Service for token management and validation
interface JWTPayload {
  sub: string; // user ID
  email: string;
  role: 'freelancer' | 'employer';
  iat: number; // issued at
  exp: number; // expires at
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class JWTService {
  private readonly ACCESS_TOKEN_KEY = 'invoy_access_token';
  private readonly REFRESH_TOKEN_KEY = 'invoy_refresh_token';
  private readonly TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer

  // Store tokens securely
  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Clear all tokens
  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // Decode JWT payload (client-side validation only)
  decodeToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      return payload as JWTPayload;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
  }

  // Check if token needs refresh (expires within buffer time)
  shouldRefreshToken(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;

    const now = Date.now();
    const expiryTime = payload.exp * 1000;
    return (expiryTime - now) <= this.TOKEN_EXPIRY_BUFFER;
  }

  // Get user info from token
  getUserFromToken(token: string): { id: string; email: string; role: string } | null {
    const payload = this.decodeToken(token);
    if (!payload) return null;

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
  }

  // Validate token format
  isValidTokenFormat(token: string): boolean {
    if (!token) return false;
    const parts = token.split('.');
    return parts.length === 3;
  }
}

export const jwtService = new JWTService();
export default jwtService;