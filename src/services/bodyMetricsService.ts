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

// New interface for body measurements (circumference only) - Updated to match API spec
export interface BodyMeasurements {
  id: number;
  chest: string; // API returns as string with decimal precision
  waist: string;
  hips: string;
  biceps: string;
  forearms: string;
  thighs: string;
  calves: string;
  neck: string;
  measurementDate: string;
  notes: string | null;
}

// Analytics interface for progress tracking
export interface BodyMetricsAnalytics {
  totalMeasurements: number;
  dateRange: {
    start: string;
    end: string;
  };
  progress: {
    chest: MeasurementProgress;
    waist: MeasurementProgress;
    hips: MeasurementProgress;
    biceps: MeasurementProgress;
    forearms: MeasurementProgress;
    thighs: MeasurementProgress;
    calves: MeasurementProgress;
    neck: MeasurementProgress;
  };
}

export interface MeasurementProgress {
  start: string;
  current: string;
  change: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Interface for logging new body metrics
export interface LogBodyMetricsRequest {
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  neck?: number;
  measurementDate?: string;
  notes?: string;
}

// Interface for updating existing body metrics
export interface UpdateBodyMetricsRequest extends Partial<LogBodyMetricsRequest> {
  // All fields are optional for updates
  // At least one field must be provided
}

// Extended interface for body metrics with timestamps
export interface ExtendedBodyMeasurements extends BodyMeasurements {
  created_at: string;
  updated_at: string;
}

// New interface for body composition (muscle mass, body fat, etc.)
export interface BodyComposition {
  id: number;
  bodyFatPercentage: string | null; // API returns as string with decimal precision or null
  muscleMass: string | null;
  boneMass: string | null;
  waterPercentage: string | null;
  measurementDate: string;
  notes: string | null;
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
  measurementDate?: string; // Optional - defaults to current date
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
  period?: number; // Analysis period in days (default: 30, max: 365)
  startDate?: string; // Custom start date for analysis (YYYY-MM-DD)
  endDate?: string; // Custom end date for analysis (YYYY-MM-DD)
}

export interface WeightAnalytics {
  totalEntries: number;
  dateRange: {
    start: string;
    end: string;
    days: number;
  };
  weight: {
    start: string;
    current: string;
    change: number;
    changePercentage: number;
    average: string;
    highest: string;
    lowest: string;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  bmi: {
    start: number;
    current: number;
    change: number;
    changePercentage: number;
    average: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  progress: {
    weeklyChange: number;
    monthlyChange: number;
    goalProgress: number | null;
  };
}

export interface WeightInsightsParams {
  period?: number; // Analysis period in days (default: 30, max: 365)
  includeRecommendations?: boolean; // Include personalized recommendations (default: true)
}

export interface WeightInsights {
  insights: string[];
  recommendations: string[];
  summary: {
    totalEntries: number;
    period: string;
    weightChange: number;
    weightChangePercentage: number;
    consistencyScore?: number;
    trendStrength?: string;
  };
  patterns?: {
    measurementFrequency: string;
    bestMeasurementTime: string;
    weightVariability: string;
    correlationFactors: {
      sleep: string;
      stress: string;
      mood: string;
    };
  };
}

// Interface for the actual API response structure
export interface WeightInsightsResponse {
  insights: WeightInsights;
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

  // Log new weight entry - implements POST /api/body-metrics/weight/log
  logWeight: async (token: string, data: {
    weight: number;
    weightUnit: 'kg' | 'lbs';
    measurementDate?: string;
    measurementTime?: string;
    measurementCondition?: string;
    notes?: string;
    mood?: string;
    sleepHours?: number;
    stressLevel?: 'low' | 'medium' | 'high';
  }): Promise<ApiResponse<{ entry: any; message: string }>> => {
    try {
      const response = await apiCall('/body-metrics/weight/log', {
      method: 'POST',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json'
        },
      body: JSON.stringify(data)
    });
      return response;
    } catch (error) {
      console.error('Error logging weight:', error);
      return {
        success: false,
        error: 'Failed to log weight',
        message: 'An error occurred while logging weight'
      };
    }
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

  // Get weight analytics - implements GET /api/body-metrics/weight/analytics
  getWeightAnalytics: async (token: string, params: WeightAnalyticsParams = {}): Promise<ApiResponse<{ analytics: WeightAnalytics }>> => {
    try {
    const queryParams = new URLSearchParams();
      if (params.period) queryParams.append('period', params.period.toString());
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

    const endpoint = `/body-metrics/weight/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiCall(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
      return response;
    } catch (error) {
      console.error('Error fetching weight analytics:', error);
      return {
        success: false,
        error: 'Failed to get weight analytics',
        message: 'An error occurred while calculating analytics'
      };
    }
  },

  // Get weight insights - implements GET /api/body-metrics/weight/insights
  getWeightInsights: async (token: string, params: WeightInsightsParams = {}): Promise<ApiResponse<WeightInsights>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.period) queryParams.append('period', params.period.toString());
      if (params.includeRecommendations !== undefined) {
        queryParams.append('includeRecommendations', params.includeRecommendations.toString());
      }

      const endpoint = `/body-metrics/weight/insights${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiCall(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
      return response;
    } catch (error) {
      console.error('Error fetching weight insights:', error);
      return {
        success: false,
        error: 'Failed to generate insights',
        message: 'An error occurred while analyzing weight data'
      };
    }
  }
};

// New Body Measurements Service (Circumference measurements only)
export const bodyMeasurementsService = {
  // Get current body measurements - implements /api/body-metrics/current
  getCurrentMeasurements: async (token: string): Promise<ApiResponse<{ metrics: BodyMeasurements | null }>> => {
    try {
      const response = await apiCall('/body-metrics/current', {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
      
      // Transform the response to match our interface
      if (response.success && response.data) {
        return {
          ...response,
          data: {
            metrics: response.data.metrics || null
          }
        };
      }
      
      return response;
    } catch (error) {
      // Handle API errors gracefully
      return {
        success: false,
        error: 'Failed to get body metrics',
        message: 'An error occurred while fetching body metrics'
      };
    }
  },

  // Get current body metrics - implements the exact API spec from documentation
  getCurrentBodyMetrics: async (token: string): Promise<ApiResponse<{ metrics: BodyMeasurements | null }>> => {
    try {
      const response = await apiCall('/body-metrics/current', {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
      
      // Handle the exact API response format from documentation
      if (response.success) {
        // Check if we have metrics data
        if (response.data && response.data.metrics) {
          return {
            success: true,
            data: {
              metrics: response.data.metrics
            }
          };
        } else {
          // No data found case
          return {
            success: true,
            data: {
              metrics: null
            },
            message: response.data?.message || 'No body metrics data found for this user'
          };
        }
      }
      
      // Handle error responses
      return {
        success: false,
        error: response.error || 'Failed to get body metrics',
        message: response.message || 'An error occurred while fetching body metrics'
      };
    } catch (error: any) {
      // Handle network/server errors
      return {
        success: false,
        error: 'Failed to get body metrics',
        message: 'An error occurred while fetching body metrics'
      };
    }
  },

  // Get body metrics history - implements /api/body-metrics/history
  getBodyMetricsHistory: async (token: string, params: PaginationParams = {}): Promise<ApiResponse<{ metrics: BodyMeasurements[], pagination: any }>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const endpoint = `/body-metrics/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiCall(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });

      // Transform the response to match our interface
      if (response.success && response.data) {
        return {
          ...response,
          data: {
            metrics: response.data.metrics || [],
            pagination: response.data.pagination || {
              currentPage: 1,
              totalPages: 0,
              totalItems: 0,
              itemsPerPage: 10
            }
          }
        };
      }

      return response;
    } catch (error) {
      // Handle API errors gracefully
      return {
        success: false,
        error: 'Failed to get metrics history',
        message: 'An error occurred while fetching metrics history'
      };
    }
  },

  // Get body metrics analytics - implements /api/body-metrics/analytics
  getBodyMetricsAnalytics: async (token: string, params: { startDate?: string; endDate?: string } = {}): Promise<ApiResponse<{ analytics: BodyMetricsAnalytics | null }>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const endpoint = `/body-metrics/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiCall(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });

      // Transform the response to match our interface
      if (response.success && response.data) {
        return {
          ...response,
          data: {
            analytics: response.data.analytics || null
          }
        };
      }

      return response;
    } catch (error) {
      // Handle API errors gracefully
      return {
        success: false,
        error: 'Failed to get analytics',
        message: 'An error occurred while fetching analytics'
      };
    }
  },

  // Get body metrics goals - implements /api/body-metrics/goals
  getBodyMetricsGoals: async (token: string): Promise<ApiResponse<{ goals: BodyMeasurements[] }>> => {
    try {
      const response = await apiCall('/body-metrics/goals', {
        method: 'GET',
        headers: getAuthHeaders(token)
      });

      // Transform the response to match our interface
      if (response.success && response.data) {
        return {
          ...response,
          data: {
            goals: response.data.goals || []
          }
        };
      }

      return response;
    } catch (error) {
      // Handle API errors gracefully
      return {
        success: false,
        error: 'Failed to get goals',
        message: 'An error occurred while fetching goals'
      };
    }
  },

  // Log new body metrics - implements POST /api/body-metrics/
  logBodyMetrics: async (token: string, data: LogBodyMetricsRequest): Promise<ApiResponse<{ metrics: BodyMeasurements }>> => {
    try {
      const response = await apiCall('/body-metrics/', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      // Transform the response to match our interface
      if (response.success && response.data) {
        return {
          ...response,
          data: {
            metrics: response.data.metrics
          }
        };
      }

      return response;
    } catch (error) {
      // Handle API errors gracefully
      return {
        success: false,
        error: 'Failed to log body metrics',
        message: 'An error occurred while logging body metrics'
      };
    }
  },

  // Update existing body metrics - implements PUT /api/body-metrics/:id
  updateBodyMetrics: async (token: string, id: number, data: LogBodyMetricsRequest): Promise<ApiResponse<{ metrics: BodyMeasurements }>> => {
    try {
      const response = await apiCall(`/body-metrics/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      // Transform the response to match our interface
      if (response.success && response.data) {
        return {
          ...response,
          data: {
            metrics: response.data.metrics
          }
        };
      }

      return response;
    } catch (error) {
      // Handle API errors gracefully
      return {
        success: false,
        error: 'Failed to update body metrics',
        message: 'An error occurred while updating body metrics'
      };
    }
  },

  // Delete body metrics - implements DELETE /api/body-metrics/:id
  deleteBodyMetrics: async (token: string, id: number): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiCall(`/body-metrics/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });

      // Transform the response to match our interface
      if (response.success && response.data) {
        return {
          ...response,
          data: {
            message: response.data.message || 'Body metrics deleted successfully'
          }
        };
      }

      return response;
    } catch (error) {
      // Handle API errors gracefully
      return {
        success: false,
        error: 'Failed to delete body metrics',
        message: 'An error occurred while deleting body metrics'
      };
    }
  },

  // Get body metrics by ID - implements GET /api/body-metrics/:id
  getBodyMetricsById: async (token: string, id: number): Promise<ApiResponse<{ bodyMetrics: ExtendedBodyMeasurements }>> => {
    try {
      const response = await apiCall(`/body-metrics/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });

      // Transform the response to match our interface
      if (response.success && response.data) {
        return {
          ...response,
          data: {
            bodyMetrics: response.data.bodyMetrics
          }
        };
      }

      return response;
    } catch (error) {
      // Handle API errors gracefully
      return {
        success: false,
        error: 'Failed to get body metrics',
        message: 'An error occurred while fetching body metrics'
      };
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

// Utility functions for formatting and displaying body metrics
export const bodyMetricsUtils = {
  // Format measurement value for display (e.g., "95.5 cm" instead of "95.50")
  formatMeasurement: (value: string | number, unit: string = 'cm'): string => {
    if (!value) return 'Not provided';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'Invalid value';
    
    // Remove trailing zeros and format to 1 decimal place
    const formatted = numValue.toFixed(1).replace(/\.?0+$/, '');
    return `${formatted} ${unit}`;
  },

  // Format measurement date for display
  formatMeasurementDate: (dateString: string): string => {
    if (!dateString) return 'No date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  },

  // Check if measurements are recent (within last 30 days)
  isRecentMeasurement: (dateString: string): boolean => {
    if (!dateString) return false;
    
    try {
      const measurementDate = new Date(dateString);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      return measurementDate >= thirtyDaysAgo;
    } catch (error) {
      return false;
    }
  },

  // Calculate measurement change between two measurements
  calculateChange: (current: string | number, previous: string | number): { value: number; percentage: number; isPositive: boolean } => {
    const currentNum = typeof current === 'string' ? parseFloat(current) : current;
    const previousNum = typeof previous === 'string' ? parseFloat(previous) : previous;
    
    if (isNaN(currentNum) || isNaN(previousNum)) {
      return { value: 0, percentage: 0, isPositive: false };
    }
    
    const change = currentNum - previousNum;
    const percentage = previousNum > 0 ? (change / previousNum) * 100 : 0;
    
    return {
      value: Math.abs(change),
      percentage: Math.abs(percentage),
      isPositive: change >= 0
    };
  },

  // Format change for display (legacy format)
  formatChangeLegacy: (change: { value: number; percentage: number; isPositive: boolean }): string => {
    if (change.value === 0) return 'No change';
    
    const sign = change.isPositive ? '+' : '-';
    return `${sign}${change.value.toFixed(1)} cm (${change.percentage.toFixed(1)}%)`;
  },

  // Get date range for filtering (last 30, 60, 90 days)
  getDateRange: (days: number): { startDate: string; endDate: string } => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  },

  // Get trend icon for progress display
  getTrendIcon: (trend: 'increasing' | 'decreasing' | 'stable'): string => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  },

  // Get trend color for progress display
  getTrendColor: (trend: 'increasing' | 'decreasing' | 'stable'): 'success' | 'error' | 'info' => {
    switch (trend) {
      case 'increasing': return 'success';
      case 'decreasing': return 'error';
      case 'stable': return 'info';
      default: return 'info';
    }
  },

  // Format change value for display
  formatChange: (change: number): string => {
    if (change === 0) return '0.0 cm';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)} cm`;
  },

  // Check if change is significant (> 2cm)
  isSignificantChange: (change: number): boolean => {
    return Math.abs(change) > 2.0;
  },

  // Calculate progress percentage towards a goal
  calculateGoalProgress: (current: string | number, goal: string | number): number => {
    const currentNum = parseFloat(current.toString());
    const goalNum = parseFloat(goal.toString());
    
    if (goalNum === 0) return 0;
    
    // For measurements where lower is better (like waist), invert the calculation
    const isLowerBetter = false; // You can customize this based on measurement type
    
    if (isLowerBetter) {
      const progress = ((goalNum - currentNum) / goalNum) * 100;
      return Math.max(0, Math.min(100, progress));
    } else {
      const progress = (currentNum / goalNum) * 100;
      return Math.max(0, Math.min(100, progress));
    }
  },

  // Get goal status (achieved, close, far, etc.)
  getGoalStatus: (current: string | number, goal: string | number): 'achieved' | 'close' | 'far' | 'exceeded' => {
    const currentNum = parseFloat(current.toString());
    const goalNum = parseFloat(goal.toString());
    const difference = Math.abs(currentNum - goalNum);
    
    if (difference <= 0.5) return 'achieved';
    if (difference <= 2.0) return 'close';
    if (difference <= 5.0) return 'far';
    return currentNum > goalNum ? 'exceeded' : 'far';
  },

  // Get goal status color
  getGoalStatusColor: (status: 'achieved' | 'close' | 'far' | 'exceeded'): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'achieved': return 'success';
      case 'close': return 'warning';
      case 'far': return 'error';
      case 'exceeded': return 'info';
      default: return 'info';
    }
  },

  // Get goal status icon
  getGoalStatusIcon: (status: 'achieved' | 'close' | 'far' | 'exceeded'): string => {
    switch (status) {
      case 'achieved': return '🎯';
      case 'close': return '🔥';
      case 'far': return '📈';
      case 'exceeded': return '🚀';
      default: return '📊';
    }
  },

  // Format goal date for display
  formatGoalDate: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`;
    } else if (diffDays <= 30) {
      return `In ${Math.ceil(diffDays / 7)} weeks`;
    } else {
      return date.toLocaleDateString();
    }
  },

  // Validate body metrics data before submission
  validateBodyMetrics: (data: LogBodyMetricsRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check if at least one measurement is provided
    const hasMeasurements = ['chest', 'waist', 'hips', 'biceps', 'forearms', 'thighs', 'calves', 'neck'].some(
      key => data[key as keyof LogBodyMetricsRequest] !== undefined
    );
    
    if (!hasMeasurements) {
      errors.push('At least one body measurement is required');
    }
    
    // Validate each measurement value
    Object.entries(data).forEach(([key, value]) => {
      if (['chest', 'waist', 'hips', 'biceps', 'forearms', 'thighs', 'calves', 'neck'].includes(key)) {
        if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
          errors.push(`${key.charAt(0).toUpperCase() + key.slice(1)} must be a positive number`);
        }
      }
    });
    
    // Validate date if provided
    if (data.measurementDate) {
      const date = new Date(data.measurementDate);
      if (isNaN(date.getTime())) {
        errors.push('Invalid measurement date');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate body metrics update data
  validateBodyMetricsUpdate: (data: UpdateBodyMetricsRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check if at least one field is provided for update
    const hasAnyField = Object.keys(data).length > 0;
    
    if (!hasAnyField) {
      errors.push('At least one field must be provided for update');
    }
    
    // Validate each measurement value if provided
    Object.entries(data).forEach(([key, value]) => {
      if (['chest', 'waist', 'hips', 'biceps', 'forearms', 'thighs', 'calves', 'neck'].includes(key)) {
        if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
          errors.push(`${key.charAt(0).toUpperCase() + key.slice(1)} must be a positive number`);
        }
      }
    });
    
    // Validate date if provided
    if (data.measurementDate) {
      const date = new Date(data.measurementDate);
      if (isNaN(date.getTime())) {
        errors.push('Invalid measurement date');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get today's date in YYYY-MM-DD format
  getTodayDate: (): string => {
    return new Date().toISOString().split('T')[0];
  },

  // Format measurement value for display
  formatMeasurementValue: (value: number | undefined): string => {
    if (value === undefined || value === null) return '';
    return value.toString();
  },

  // Parse measurement value from string
  parseMeasurementValue: (value: string): number | undefined => {
    if (!value || value.trim() === '') return undefined;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  },

  // Format timestamp for display
  formatTimestamp: (timestamp: string): string => {
    if (!timestamp) return 'Not available';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return 'Invalid timestamp';
    }
  },

  // Get relative time (e.g., "2 hours ago", "3 days ago")
  getRelativeTime: (timestamp: string): string => {
    if (!timestamp) return 'Not available';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));
      
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
      if (diffDays < 365) return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
      return `${Math.ceil(diffDays / 365)} year${Math.ceil(diffDays / 365) > 1 ? 's' : ''} ago`;
    } catch (error) {
      return 'Invalid timestamp';
    }
  },

  // Body Composition Utilities
  // Format body fat percentage for display
  formatBodyFatPercentage: (percentage: string): string => {
    if (!percentage) return 'N/A';
    return `${percentage}%`;
  },

  // Format muscle mass for display
  formatMuscleMass: (mass: string): string => {
    if (!mass) return 'N/A';
    return `${mass} kg`;
  },

  // Format bone mass for display
  formatBoneMass: (mass: string): string => {
    if (!mass) return 'N/A';
    return `${mass} kg`;
  },

  // Format water percentage for display
  formatWaterPercentage: (percentage: string): string => {
    if (!percentage) return 'N/A';
    return `${percentage}%`;
  },

  // Validate body composition data
  validateBodyComposition: (data: CreateBodyCompositionRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check if at least one field is provided
    const hasAnyField = data.bodyFatPercentage !== undefined || 
                       data.muscleMass !== undefined || 
                       data.boneMass !== undefined || 
                       data.waterPercentage !== undefined;
    
    if (!hasAnyField) {
      errors.push('At least one field must be provided');
    }
    
    // Validate body fat percentage (0-100%)
    if (data.bodyFatPercentage !== undefined) {
      if (typeof data.bodyFatPercentage !== 'number' || data.bodyFatPercentage < 0 || data.bodyFatPercentage > 100) {
        errors.push('Body fat percentage must be between 0 and 100');
      }
    }
    
    // Validate muscle mass (positive number)
    if (data.muscleMass !== undefined) {
      if (typeof data.muscleMass !== 'number' || data.muscleMass <= 0) {
        errors.push('Muscle mass must be a positive number');
      }
    }
    
    // Validate bone mass (positive number)
    if (data.boneMass !== undefined) {
      if (typeof data.boneMass !== 'number' || data.boneMass <= 0) {
        errors.push('Bone mass must be a positive number');
      }
    }
    
    // Validate water percentage (0-100%)
    if (data.waterPercentage !== undefined) {
      if (typeof data.waterPercentage !== 'number' || data.waterPercentage < 0 || data.waterPercentage > 100) {
        errors.push('Water percentage must be between 0 and 100');
      }
    }
    
    // Validate date if provided
    if (data.measurementDate) {
      const date = new Date(data.measurementDate);
      if (isNaN(date.getTime())) {
        errors.push('Invalid measurement date');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Format composition value for display
  formatCompositionValue: (value: number | undefined): string => {
    if (value === undefined || value === null) return '';
    return value.toString();
  },

  // Parse composition value from string
  parseCompositionValue: (value: string): number | undefined => {
    if (!value || value.trim() === '') return undefined;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  }
};

// New Body Composition Service (Body fat, muscle mass, etc.)
export const bodyCompositionService = {
  // Get current body composition - implements GET /api/body-metrics/composition/current
  getCurrentComposition: async (token: string): Promise<ApiResponse<{ composition: BodyComposition }>> => {
    try {
      const response = await apiCall('/body-metrics/composition/current', {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
      return response;
    } catch (error) {
      console.error('Error fetching current body composition:', error);
      return {
        success: false,
        error: 'Failed to get body composition',
        message: 'An error occurred while fetching body composition'
      };
    }
  },

  // Get composition history
  getCompositionHistory: async (token: string, params: { page?: number; limit?: number; startDate?: string; endDate?: string } = {}): Promise<ApiResponse<{ compositions: BodyComposition[]; pagination: any }>> => {
    try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

      const endpoint = `/body-metrics/composition/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiCall(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });

      // Transform API response to match frontend expectations
      if (response.success && response.data) {
        return {
          ...response,
          data: {
            compositions: response.data.composition || [], // Transform "composition" to "compositions"
            pagination: response.data.pagination || {}
          }
        };
      }

      return response;
    } catch (error) {
      console.error('Error fetching composition history:', error);
      return {
        success: false,
        error: 'Failed to get composition history',
        message: 'An error occurred while fetching composition history'
      };
    }
  },

  // Log new body composition - implements POST /api/body-metrics/composition/log
  logComposition: async (token: string, data: CreateBodyCompositionRequest): Promise<ApiResponse<{ composition: BodyComposition; message: string }>> => {
    try {
      const response = await apiCall('/body-metrics/composition/log', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response;
    } catch (error) {
      console.error('Error logging body composition:', error);
      return {
        success: false,
        error: 'Failed to log body composition',
        message: 'An error occurred while logging body composition'
      };
    }
  },

  // Update body composition - implements PUT /api/body-metrics/composition/:id
  updateComposition: async (token: string, id: number, data: UpdateBodyCompositionRequest): Promise<ApiResponse<{ composition: BodyComposition; message: string }>> => {
    try {
      const response = await apiCall(`/body-metrics/composition/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response;
    } catch (error) {
      console.error('Error updating body composition:', error);
      return {
        success: false,
        error: 'Failed to update body composition',
        message: 'An error occurred while updating body composition'
      };
    }
  },

  // Get composition analytics - implements GET /api/body-metrics/composition/analytics
  getCompositionAnalytics: async (token: string, params: { startDate?: string; endDate?: string } = {}): Promise<ApiResponse<{ analytics: any; message?: string }>> => {
    try {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

      const endpoint = `/body-metrics/composition/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiCall(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
      return response;
    } catch (error) {
      console.error('Error fetching composition analytics:', error);
      return {
        success: false,
        error: 'Failed to get composition analytics',
        message: 'An error occurred while fetching composition analytics'
      };
    }
  },

  // Delete body composition - implements DELETE /api/body-metrics/composition/:id
  deleteComposition: async (token: string, id: number): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiCall(`/body-metrics/composition/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });
      return response;
    } catch (error) {
      console.error('Error deleting body composition:', error);
      return {
        success: false,
        error: 'Failed to delete body composition',
        message: 'An error occurred while deleting body composition'
      };
    }
  },

  // Get composition by ID
  getCompositionById: async (token: string, id: number): Promise<ApiResponse<{ composition: BodyComposition }>> => {
    try {
      const response = await apiCall(`/body-metrics/composition/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
      return response;
    } catch (error) {
      console.error('Error fetching body composition by ID:', error);
      return {
        success: false,
        error: 'Failed to get body composition',
        message: 'An error occurred while fetching body composition'
      };
    }
  },

  // Get weight history - implements GET /api/body-metrics/weight/history
  getWeightHistory: async (token: string, params: { page?: number; limit?: number; startDate?: string; endDate?: string } = {}): Promise<ApiResponse<{ weightHistory: any[]; pagination: any }>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const endpoint = `/body-metrics/weight/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiCall(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });
      return response;
    } catch (error) {
      console.error('Error fetching weight history:', error);
      return {
        success: false,
        error: 'Failed to get weight history',
        message: 'An error occurred while fetching weight history'
      };
    }
  },

  // Log new weight entry - implements POST /api/body-metrics/weight/log
  logWeight: async (token: string, data: {
    weight: number;
    weightUnit: 'kg' | 'lbs';
    measurementDate?: string;
    measurementTime?: string;
    measurementCondition?: string;
    notes?: string;
    mood?: string;
    sleepHours?: number;
    stressLevel?: 'low' | 'medium' | 'high';
  }): Promise<ApiResponse<{ entry: any; message: string }>> => {
    try {
      const response = await apiCall('/body-metrics/weight/log', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response;
    } catch (error) {
      console.error('Error logging weight:', error);
      return {
        success: false,
        error: 'Failed to log weight',
        message: 'An error occurred while logging weight'
      };
    }
  },


};
