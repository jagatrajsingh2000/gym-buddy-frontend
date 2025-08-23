import { getAuthHeaders, apiCall, ApiResponse } from './api';

// Client Profile interfaces
export interface ClientProfileData {
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
  user: {
    id: number;
    email: string;
    userType: 'client';
    firstName: string;
    lastName: string;
    phone: string | null;
    dateOfBirth: string | null;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
  };
  gym?: {
    id: number;
    name: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
  } | null;
  trainer?: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
    };
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
  } | null;
}

export interface UpdateClientProfileData {
  managementType?: 'self' | 'gym' | 'trainer';
  clientSource?: 'direct' | 'referral' | 'online' | 'gym';
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
}

export const clientService = {
  // Get client profile
  getClientProfile: async (token: string): Promise<ApiResponse<{ client: ClientProfileData }>> => {
    return await apiCall('/client/profile', {
      headers: getAuthHeaders(token)
    });
  },

  // Update client profile
  updateClientProfile: async (token: string, profileData: UpdateClientProfileData): Promise<ApiResponse<{ client: ClientProfileData }>> => {
    return await apiCall('/client/profile', {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(profileData)
    });
  },

  // Update user profile (for clients)
  updateUserProfile: async (token: string, userData: UpdateUserProfileData): Promise<ApiResponse<any>> => {
    return await apiCall('/auth/profile', {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData)
    });
  }
};
