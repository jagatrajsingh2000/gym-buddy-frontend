import { getAuthHeaders, apiCall, ApiResponse } from './api';

// Body Metrics Interfaces
export interface BodyMetrics {
  id: number;
  userId: number;
  height: string;
  heightUnit: string;
  weight: string;
  weightUnit: string;
  bodyFatPercentage: string;
  muscleMass: string | null;
  boneMass: string | null;
  waterPercentage: string | null;
  chest: string;
  waist: string;
  hips: string;
  biceps: string;
  forearms: string | null;
  thighs: string;
  calves: string | null;
  neck: string | null;
  targetWeight: string;
  targetBodyFat: string;
  bmi: string;
  bmr: string;
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
  notes?: string;
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
