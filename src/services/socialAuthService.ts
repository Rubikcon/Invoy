// Social Authentication Service for Google and GitHub
import { User, RegisterData } from '../types';

// Mock Google OAuth response
interface GoogleAuthResponse {
  profileObj: {
    googleId: string;
    name: string;
    email: string;
    imageUrl: string;
  };
  tokenId: string;
}

// Mock GitHub OAuth response
interface GitHubAuthResponse {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

export const socialAuthService = {
  // Initialize Google Auth (in production, this would use actual Google OAuth)
  initGoogleAuth(): Promise<void> {
    return new Promise((resolve) => {
      // Mock initialization
      setTimeout(() => resolve(), 100);
    });
  },

  // Google Sign In
  async signInWithGoogle(): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      // In production, this would use actual Google OAuth
      // For demo purposes, we'll simulate the flow
      return new Promise((resolve) => {
        // Simulate Google OAuth popup
        const mockGoogleResponse: GoogleAuthResponse = {
          profileObj: {
            googleId: 'google_' + Date.now(),
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
          },
          tokenId: 'mock_token_' + Date.now()
        };

        // Create user from Google response
        const user: User = {
          id: `google_${mockGoogleResponse.profileObj.googleId}`,
          email: mockGoogleResponse.profileObj.email,
          name: mockGoogleResponse.profileObj.name,
          role: 'freelancer', // Default role, can be changed later
          avatar: mockGoogleResponse.profileObj.imageUrl,
          createdAt: new Date(),
          isEmailVerified: true, // Google accounts are pre-verified
        };

        // Save to localStorage (in production, this would go to your backend)
        const users = JSON.parse(localStorage.getItem('invoy_users') || '[]');
        const existingUser = users.find((u: any) => u.email === user.email);
        
        if (existingUser) {
          resolve({
            success: true,
            user: {
              ...existingUser,
              createdAt: new Date(existingUser.createdAt),
              lastLoginAt: existingUser.lastLoginAt ? new Date(existingUser.lastLoginAt) : undefined
            },
            message: 'Successfully signed in with Google'
          });
        } else {
          const storedUser = {
            ...user,
            createdAt: user.createdAt.toISOString(),
            passwordHash: 'google_oauth' // Special marker for OAuth users
          };
          users.push(storedUser);
          localStorage.setItem('invoy_users', JSON.stringify(users));
          
          resolve({
            success: true,
            user,
            message: 'Successfully registered with Google'
          });
        }
      });
    } catch (error) {
      return {
        success: false,
        message: 'Failed to sign in with Google. Please try again.'
      };
    }
  },

  // GitHub Sign In
  async signInWithGitHub(): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      // In production, this would use actual GitHub OAuth
      // For demo purposes, we'll simulate the flow
      return new Promise((resolve) => {
        // Simulate GitHub OAuth popup
        const mockGitHubResponse: GitHubAuthResponse = {
          id: Date.now(),
          login: 'johndoe',
          name: 'John Doe',
          email: 'john.doe@github.com',
          avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
        };

        // Create user from GitHub response
        const user: User = {
          id: `github_${mockGitHubResponse.id}`,
          email: mockGitHubResponse.email,
          name: mockGitHubResponse.name,
          role: 'freelancer', // Default role, can be changed later
          avatar: mockGitHubResponse.avatar_url,
          createdAt: new Date(),
          isEmailVerified: true, // GitHub accounts are pre-verified
        };

        // Save to localStorage (in production, this would go to your backend)
        const users = JSON.parse(localStorage.getItem('invoy_users') || '[]');
        const existingUser = users.find((u: any) => u.email === user.email);
        
        if (existingUser) {
          resolve({
            success: true,
            user: {
              ...existingUser,
              createdAt: new Date(existingUser.createdAt),
              lastLoginAt: existingUser.lastLoginAt ? new Date(existingUser.lastLoginAt) : undefined
            },
            message: 'Successfully signed in with GitHub'
          });
        } else {
          const storedUser = {
            ...user,
            createdAt: user.createdAt.toISOString(),
            passwordHash: 'github_oauth' // Special marker for OAuth users
          };
          users.push(storedUser);
          localStorage.setItem('invoy_users', JSON.stringify(users));
          
          resolve({
            success: true,
            user,
            message: 'Successfully registered with GitHub'
          });
        }
      });
    } catch (error) {
      return {
        success: false,
        message: 'Failed to sign in with GitHub. Please try again.'
      };
    }
  },

  // Role Selection for Social Auth Users
  async updateUserRole(userId: string, role: 'freelancer' | 'employer'): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      const users = JSON.parse(localStorage.getItem('invoy_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }

      users[userIndex].role = role;
      localStorage.setItem('invoy_users', JSON.stringify(users));

      const updatedUser: User = {
        ...users[userIndex],
        createdAt: new Date(users[userIndex].createdAt),
        lastLoginAt: users[userIndex].lastLoginAt ? new Date(users[userIndex].lastLoginAt) : undefined
      };

      return {
        success: true,
        user: updatedUser,
        message: 'Role updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update role'
      };
    }
  }
};