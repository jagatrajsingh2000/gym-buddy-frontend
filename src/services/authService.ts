import { api, getAuthHeaders, apiCall } from './api';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'admin' | 'client' | 'trainer';
  phone?: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    id: number;
    firstName: string;
    lastName: string;
    permissions: string[];
    gymName?: string;
    specialization?: string;
    experience?: string;
    location?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userType: 'admin' | 'client' | 'trainer';
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const authService = {
  // Register new user
  register: async (userData: RegisterRequest) => {
    return await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // User login
  login: async (credentials: LoginRequest) => {
    return await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Get current user profile
  getProfile: async (token: string) => {
    return await apiCall('/auth/profile', {
      headers: getAuthHeaders(token)
    });
  },

  // Update user profile
  updateProfile: async (token: string, profileData: ProfileUpdateRequest) => {
    return await apiCall('/auth/profile', {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(profileData)
    });
  },

  // Change password
  changePassword: async (token: string, passwordData: ChangePasswordRequest) => {
    return await apiCall('/auth/change-password', {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(passwordData)
    });
  },

  // User logout
  logout: async (token: string) => {
    return await apiCall('/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders(token)
    });
  }
};
