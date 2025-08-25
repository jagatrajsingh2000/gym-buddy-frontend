import { getAuthHeaders, apiCall, ApiResponse } from './api';

// Body Metrics Interfaces - Updated for API separation
export interface BodyMetrics {
  id: number;
  userId: number;
  height?: string;
  heightUnit?: string;
  weight?: string;
  weightUnit?: string;
  bodyFatPercentage?: string;
  muscleMass?: string | null;
  boneMass?: string | null;
  waterPercentage?: string | null;
  chest?: string | null;
  waist?: string | null;
  hips?: string | null;
  biceps?: string | null;
  forearms?: string | null;
  thighs?: string | null;
  calves?: string | null;
  neck?: string | null;
  targetWeight?: string;
  targetBodyFat?: string;
  targetMuscleMass?: string;
  targetChest?: string;
  targetWaist?: string;
  targetHips?: string;
  bmi?: string;
  bmr?: string;
  measurementDate: string;
  notes: string | null;
  isGoal: boolean;
  created_at: string;
  updated_at: string;
}

// New interface for body measurements (circumference only)
export interface BodyMeasurements {
  id: number;
  userId: number;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  biceps: number | null;
  forearms: number | null;
  thighs: number | null;
  calves: number | null;
  neck: number | null;
  measurementDate: string;
  notes: string | null;
  isGoal: boolean;
  created_at: string;
  updated_at: string;
}

// New interface for body composition (muscle mass, body fat, etc.)
export interface BodyComposition {
  id: number;
  userId: number;
  bodyFatPercentage: number | null;
  muscleMass: number | null;
  boneMass: number | null;
  waterPercentage: number | null;
  measurementDate: string;
  notes: string | null;
  isGoal: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeightHistory {
  id: number;
  userId: number;
  weight: string;
  weightUnit: string;
  height?: string;
  heightUnit?: string;
  bmi?: string;
  measurementDate: string;
  measurementTime: string;
  measurementCondition: string;
  notes: string | null;
  mood: string;
  sleepHours: number;
  stressLevel: string;
  created_at: string;
  updated_at: string;
}

// Legacy interfaces for backward compatibility
export interface CreateBodyMetricsRequest {
  measurementDate: string;
  weight?: number;
  height?: number;
  bodyFatPercentage?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  neck?: number;
  targetWeight?: number;
  targetBodyFat?: number;
  notes?: string;
}

export interface UpdateBodyMetricsRequest {
  weight?: number;
  height?: number;
  bodyFatPercentage?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  neck?: number;
  targetWeight?: number;
  targetBodyFat?: number;
  notes?: string;
}

// New interfaces for separated APIs
export interface CreateBodyMeasurementsRequest {
  measurementDate: string;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  neck?: number;
  notes?: string;
  isGoal?: boolean;
}

export interface UpdateBodyMeasurementsRequest {
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  neck?: number;
  notes?: string;
}

export interface CreateBodyCompositionRequest {
  measurementDate: string;
  bodyFatPercentage?: number;
  muscleMass?: number;
  boneMass?: number;
  waterPercentage?: number;
  notes?: string;
  isGoal?: boolean;
}

export interface UpdateBodyCompositionRequest {
  bodyFatPercentage?: number;
  muscleMass?: number;
  boneMass?: number;
  waterPercentage?: number;
  notes?: string;
}

export interface CreateWeightEntryRequest {
  weight: number;
  measurementDate: string;
  weightUnit?: string;
  measurementTime?: string;
  measurementCondition?: string;
  notes?: string;
  mood?: string;
  sleepHours?: number;
  stressLevel?: string;
}

export interface UpdateWeightEntryRequest {
  weight?: number;
  weightUnit?: string;
  measurementTime?: string;
  measurementCondition?: string;
  notes?: string;
  mood?: string;
  sleepHours?: number;
  stressLevel?: string;
}

export interface CreateGoalRequest {
  measurementDate: string;
  weight?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  notes?: string;
  isGoal?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface WeightHistoryParams extends PaginationParams {
  condition?: string;
}

export interface WeightAnalyticsParams {
  days?: number;
  groupBy?: 'week' | 'month';
}

export interface PaginatedResponse<T> {
  items?: T[];
  metrics?: T[]; // API actually returns 'metrics' instead of 'items'
  weightHistory?: T[]; // API returns 'weightHistory' for weight endpoints
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const bodyMetricsService = {
  // Get current body metrics
  getCurrentMetrics: async (token: string): Promise<ApiResponse<BodyMetrics>> => {
    return apiCall('/body-metrics/current', {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
  },

  // Get metrics history
  getMetricsHistory: async (token: string, params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<BodyMetrics>>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const endpoint = `/body-metrics/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
  },

  // Create new body metrics
  createMetrics: async (token: string, data: CreateBodyMetricsRequest): Promise<ApiResponse<BodyMetrics>> => {
    return apiCall('/body-metrics', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  },

  // Update body metrics
  updateMetrics: async (token: string, id: number, data: UpdateBodyMetricsRequest): Promise<ApiResponse<BodyMetrics>> => {
    return apiCall(`/body-metrics/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  },

  // Delete body metrics
  deleteMetrics: async (token: string, id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiCall(`/body-metrics/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
  },

  // Get progress analytics
  getAnalytics: async (token: string, days: number = 30): Promise<ApiResponse<any>> => {
    return apiCall(`/body-metrics/analytics?days=${days}`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
  },

  // Get goals
  getGoals: async (token: string): Promise<ApiResponse<BodyMetrics[]>> => {
    return apiCall('/body-metrics/goals', {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
  },

  // Set new goal
  createGoal: async (token: string, data: CreateGoalRequest): Promise<ApiResponse<BodyMetrics>> => {
    return apiCall('/body-metrics/goals', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  },

  // Get weight history
  getWeightHistory: async (token: string, params: WeightHistoryParams = {}): Promise<ApiResponse<PaginatedResponse<WeightHistory>>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.condition) queryParams.append('condition', params.condition);

    const endpoint = `/body-metrics/weight/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
  },

  // Log weight entry
  logWeight: async (token: string, data: CreateWeightEntryRequest): Promise<ApiResponse<WeightHistory>> => {
    return apiCall('/body-metrics/weight/log', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  },

  // Update weight entry
  updateWeightEntry: async (token: string, id: number, data: UpdateWeightEntryRequest): Promise<ApiResponse<WeightHistory>> => {
    return apiCall(`/body-metrics/weight/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  },

  // Delete weight entry
  deleteWeightEntry: async (token: string, id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiCall(`/body-metrics/weight/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
  },

  // Get weight analytics
  getWeightAnalytics: async (token: string, params: WeightAnalyticsParams = {}): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params.days) queryParams.append('days', params.days.toString());
    if (params.groupBy) queryParams.append('groupBy', params.groupBy);

    const endpoint = `/body-metrics/weight/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
  },

  // Get weight insights
  getWeightInsights: async (token: string, days: number = 30): Promise<ApiResponse<any>> => {
    return apiCall(`/body-metrics/weight/insights?days=${days}`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
  }
};

// New Body Measurements Service (Circumference measurements only)
export const bodyMeasurementsService = {
  // Get current body measurements
  getCurrentMeasurements: async (token: string): Promise<ApiResponse<BodyMeasurements>> => {
    try {
      // Try new API first, fallback to old API for backward compatibility
      return await apiCall('/body-metrics/current', {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
    } catch (error) {
      // Fallback to legacy API
      return await apiCall('/body-metrics/current', {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
    }
  },

  // Get measurements history
  getMeasurementsHistory: async (token: string, params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<BodyMeasurements>>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const endpoint = `/body-metrics/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
  },

  // Create new body measurements
  createMeasurements: async (token: string, data: CreateBodyMeasurementsRequest): Promise<ApiResponse<BodyMeasurements>> => {
    return apiCall('/body-metrics', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  },

  // Update body measurements
  updateMeasurements: async (token: string, id: number, data: UpdateBodyMeasurementsRequest): Promise<ApiResponse<BodyMeasurements>> => {
    return apiCall(`/body-metrics/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  },

  // Delete body measurements
  deleteMeasurements: async (token: string, id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiCall(`/body-metrics/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
  }
};

// New Body Composition Service (Body fat, muscle mass, etc.)
export const bodyCompositionService = {
  // Get current body composition
  getCurrentComposition: async (token: string): Promise<ApiResponse<BodyComposition>> => {
    try {
      // Try new API first
      return await apiCall('/body-metrics/composition/current', {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
    } catch (error) {
      // Fallback to legacy API and extract composition data
      const response = await apiCall('/body-metrics/current', {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
      
      // Transform legacy response to composition format
      if (response.success && response.data) {
        const legacy = response.data.metrics || response.data;
        const composition: BodyComposition = {
          id: legacy.id,
          userId: legacy.userId,
          bodyFatPercentage: legacy.bodyFatPercentage ? parseFloat(legacy.bodyFatPercentage) : null,
          muscleMass: legacy.muscleMass ? parseFloat(legacy.muscleMass) : null,
          boneMass: legacy.boneMass ? parseFloat(legacy.boneMass) : null,
          waterPercentage: legacy.waterPercentage ? parseFloat(legacy.waterPercentage) : null,
          measurementDate: legacy.measurementDate,
          notes: legacy.notes,
          isGoal: legacy.isGoal,
          created_at: legacy.created_at,
          updated_at: legacy.updated_at
        };
        return { ...response, data: { composition } };
      }
      return response;
    }
  },

  // Get composition history
  getCompositionHistory: async (token: string, params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<BodyComposition>>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    try {
      // Try new API first
      const endpoint = `/body-metrics/composition/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await apiCall(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
    } catch (error) {
      // Fallback to legacy API
      const endpoint = `/body-metrics/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return apiCall(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
    }
  },

  // Log body composition
  logComposition: async (token: string, data: CreateBodyCompositionRequest): Promise<ApiResponse<BodyComposition>> => {
    try {
      // Try new API first
      return await apiCall('/body-metrics/composition/log', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data)
      });
    } catch (error) {
      // Fallback to legacy API
      return apiCall('/body-metrics', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data)
      });
    }
  },

  // Update body composition
  updateComposition: async (token: string, id: number, data: UpdateBodyCompositionRequest): Promise<ApiResponse<BodyComposition>> => {
    try {
      // Try new API first
      return await apiCall(`/body-metrics/composition/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data)
      });
    } catch (error) {
      // Fallback to legacy API
      return apiCall(`/body-metrics/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data)
      });
    }
  },

  // Get composition analytics
  getCompositionAnalytics: async (token: string, params: { startDate?: string; endDate?: string } = {}): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    try {
      // Try new API first
      const endpoint = `/body-metrics/composition/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await apiCall(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
    } catch (error) {
      // Fallback to legacy analytics
      return apiCall(`/body-metrics/analytics?days=30`, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
    }
  }
};
