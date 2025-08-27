import { apiCall } from './api';

export interface User {
  id: number;
  email: string;
  userType: 'client' | 'trainer' | 'gym';
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  height?: number;
  heightUnit?: 'cm' | 'ft';
  hasGoals?: boolean;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
  clientProfile?: {
    id: number;
    userId: number;
    managementType: 'self' | 'gym' | 'trainer';
    currentGymId: number | null;
    currentTrainerId: number | null;
    clientSource: 'direct' | 'referral' | 'online' | 'gym';
    independenceRequestedAt: string | null;
    independenceGrantedAt: string | null;
    created_at: string;
    updated_at: string;
  };
  trainerProfile?: any; // Will be populated if user has trainer relationship
  gymProfile?: any; // Will be populated if user has gym relationship
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  userType: 'client' | 'trainer' | 'gym';
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  height?: number;
  heightUnit?: 'cm' | 'ft';
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  height?: number;
  heightUnit?: 'cm' | 'ft';
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ProfileUpdateError {
  error: string;
  message: string;
  details?: ValidationError[];
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  data: {
    logoutTime: string;
    tokenInvalidated: boolean;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const authService = {
  // User login
  login: async (credentials: LoginRequest): Promise<AuthApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }) as LoginResponse;

      if (response.success && response.data) {
        return {
          success: true,
          message: response.message,
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed'
        };
      }
    } catch (error: any) {
      // Handle specific API errors
      if (error.message?.includes('400')) {
        return {
          success: false,
          message: 'Email and password are required'
        };
      } else if (error.message?.includes('401')) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      } else if (error.message?.includes('429')) {
        return {
          success: false,
          message: 'Too many authentication attempts. Please try again later.'
        };
      } else {
        return {
          success: false,
          message: 'Network error. Please check your connection.'
        };
      }
    }
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<AuthApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }) as RegisterResponse;

      if (response.success && response.data) {
        return {
          success: true,
          message: response.message,
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.message || 'Registration failed'
        };
      }
    } catch (error: any) {
      // Handle specific API errors
      if (error.message?.includes('400')) {
        return {
          success: false,
          message: 'Missing required fields'
        };
      } else if (error.message?.includes('409')) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      } else if (error.message?.includes('429')) {
        return {
          success: false,
          message: 'Too many registration attempts. Please try again later.'
        };
      } else {
        return {
          success: false,
          message: 'Registration failed. Please try again.'
        };
      }
    }
  },

  // Get current user profile
  getProfile: async (token: string): Promise<AuthApiResponse<User>> => {
    try {
      const response = await apiCall('/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }) as ProfileResponse;

      if (response.success && response.data) {
        return {
          success: true,
          message: 'Profile retrieved successfully',
          data: response.data.user
        };
      } else {
        return {
          success: false,
          message: 'Failed to retrieve profile'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve profile'
      };
    }
  },

  // Update user profile
  updateProfile: async (token: string, profileData: ProfileUpdateRequest): Promise<AuthApiResponse<User>> => {
    try {
      const response = await apiCall('/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      }) as ProfileUpdateResponse;

      if (response.success && response.data) {
        return {
          success: true,
          message: response.message,
          data: response.data.user
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to update profile'
        };
      }
    } catch (error: any) {
      // Handle specific API errors
      if (error.message?.includes('400')) {
        return {
          success: false,
          message: 'Validation failed. Please check your input data.'
        };
      } else if (error.message?.includes('401')) {
        return {
          success: false,
          message: 'Token has been invalidated or no token provided'
        };
      } else if (error.message?.includes('429')) {
        return {
          success: false,
          message: 'Too many profile updates. Please try again later.'
        };
      } else {
        return {
          success: false,
          message: 'Failed to update profile. Please try again.'
        };
      }
    }
  },

  // Change password
  changePassword: async (token: string, passwordData: ChangePasswordRequest): Promise<AuthApiResponse<null>> => {
    try {
      await apiCall('/auth/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error: any) {
      // Handle specific API errors based on the documentation
      if (error.response && error.response.data) {
        const apiError = error.response.data;
        
        if (apiError.error === 'Invalid password') {
          return {
            success: false,
            message: 'Current password is incorrect'
          };
        } else if (apiError.error === 'Missing required fields') {
          return {
            success: false,
            message: 'Current password and new password are required'
          };
        } else if (apiError.error === 'Access denied') {
          return {
            success: false,
            message: 'Token has been invalidated (logged out)'
          };
        } else if (apiError.error === 'Too many password change attempts') {
          return {
            success: false,
            message: 'Too many password change attempts. Please try again later.'
          };
        } else if (apiError.message) {
          return {
            success: false,
            message: apiError.message
          };
        }
      }
      
      // Fallback error handling
      if (error.message?.includes('400')) {
        return {
          success: false,
          message: 'Missing required fields. Current password and new password are required.'
        };
      } else if (error.message?.includes('401')) {
        return {
          success: false,
          message: 'Current password is incorrect or token is invalid'
        };
      } else if (error.message?.includes('429')) {
        return {
          success: false,
          message: 'Too many password change attempts. Please try again later.'
        };
      } else {
        return {
          success: false,
          message: 'Failed to change password. Please try again.'
        };
      }
    }
  },

  // User logout
  logout: async (token: string): Promise<AuthApiResponse<{ logoutTime: string; tokenInvalidated: boolean }>> => {
    try {
      const response = await apiCall('/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }) as LogoutResponse;

      if (response.success && response.data) {
        return {
          success: true,
          message: response.message,
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.message || 'Logout failed'
        };
      }
    } catch (error: any) {
      // Handle specific API errors
      if (error.message?.includes('401')) {
        return {
          success: false,
          message: 'Token has been invalidated or no token provided'
        };
      } else if (error.message?.includes('429')) {
        return {
          success: false,
          message: 'Too many logout attempts. Please try again later.'
        };
      } else {
        // Even if logout fails on backend, we should still clear local state
        return {
          success: true,
          message: 'Logged out successfully',
          data: {
            logoutTime: new Date().toISOString(),
            tokenInvalidated: true
          }
        };
      }
    }
  }
};
