// Authentication service for user management
import { User, LoginCredentials, RegisterData, AuthState } from '../types';

const USERS_STORAGE_KEY = 'invoy_users';
const CURRENT_USER_KEY = 'invoy_current_user';
const SESSION_STORAGE_KEY = 'invoy_session';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: 'freelancer' | 'employer';
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
  isEmailVerified: boolean;
  walletAddress?: string;
  passwordHash: string; // In production, this would be properly hashed
}

// Simple hash function for demo purposes (use proper bcrypt in production)
const simpleHash = (password: string): string => {
  return btoa(password + 'invoy_salt_2024');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return simpleHash(password) === hash;
};

export const authService = {
  // Get all users from storage
  getAllUsers(): StoredUser[] {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  },

  // Save user to storage
  saveUser(user: StoredUser): void {
    try {
      const users = this.getAllUsers();
      const existingIndex = users.findIndex(u => u.id === user.id);
      
      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Failed to save user data');
    }
  },

  // Register new user
  async register(data: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const users = this.getAllUsers();
      
      // Check if email already exists
      if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        return { success: false, message: 'Email already registered' };
      }

      // Create new user
      const newUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        email: data.email.toLowerCase(),
        name: data.name,
        role: data.role,
        createdAt: new Date().toISOString(),
        isEmailVerified: true, // Auto-verify for demo
        passwordHash: simpleHash(data.password)
      };

      this.saveUser(newUser);

      const user: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        avatar: newUser.avatar,
        createdAt: new Date(newUser.createdAt),
        lastLoginAt: newUser.lastLoginAt ? new Date(newUser.lastLoginAt) : undefined,
        isEmailVerified: newUser.isEmailVerified,
        walletAddress: newUser.walletAddress
      };

      return { success: true, message: 'Registration successful', user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const users = this.getAllUsers();
      const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());

      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }

      if (!verifyPassword(credentials.password, user.passwordHash)) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Update last login
      user.lastLoginAt = new Date().toISOString();
      this.saveUser(user);

      // Create session
      const session = {
        userId: user.id,
        email: user.email,
        role: user.role,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      const authUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        createdAt: new Date(user.createdAt),
        lastLoginAt: new Date(user.lastLoginAt),
        isEmailVerified: user.isEmailVerified,
        walletAddress: user.walletAddress
      };

      return { success: true, message: 'Login successful', user: authUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  },

  // Get current user from session
  getCurrentUser(): User | null {
    try {
      const session = localStorage.getItem(SESSION_STORAGE_KEY);
      const currentUser = localStorage.getItem(CURRENT_USER_KEY);
      
      if (!session || !currentUser) {
        return null;
      }

      const user: StoredUser = JSON.parse(currentUser);
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        createdAt: new Date(user.createdAt),
        lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined,
        isEmailVerified: user.isEmailVerified,
        walletAddress: user.walletAddress
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Logout user
  logout(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Pick<User, 'name' | 'avatar' | 'walletAddress'>>): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }

      // Update user data
      const user = users[userIndex];
      if (updates.name) user.name = updates.name;
      if (updates.avatar) user.avatar = updates.avatar;
      if (updates.walletAddress) user.walletAddress = updates.walletAddress;

      this.saveUser(user);

      // Update current user in storage
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      const updatedUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        createdAt: new Date(user.createdAt),
        lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined,
        isEmailVerified: user.isEmailVerified,
        walletAddress: user.walletAddress
      };

      return { success: true, message: 'Profile updated successfully', user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  },

  // Check if session is valid
  isSessionValid(): boolean {
    try {
      const session = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!session) return false;

      const sessionData = JSON.parse(session);
      const loginTime = new Date(sessionData.loginTime);
      const now = new Date();
      
      // Session expires after 7 days
      const sessionDuration = 7 * 24 * 60 * 60 * 1000;
      return (now.getTime() - loginTime.getTime()) < sessionDuration;
    } catch (error) {
      return false;
    }
  }
};