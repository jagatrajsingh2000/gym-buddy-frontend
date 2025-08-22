import { api, getAuthHeaders, apiCall } from './api';

export interface Exercise {
  exerciseId: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
}

export interface Workout {
  id: string;
  name: string;
  type: 'push' | 'pull' | 'legs' | 'full_body' | 'cardio';
  date: string;
  duration?: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  exercises: Exercise[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutRequest {
  name: string;
  type: 'push' | 'pull' | 'legs' | 'full_body' | 'cardio';
  date: string;
  exercises: Exercise[];
  notes?: string;
}

export interface UpdateWorkoutRequest {
  name?: string;
  type?: 'push' | 'pull' | 'legs' | 'full_body' | 'cardio';
  date?: string;
  duration?: number;
  status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  exercises?: Exercise[];
  notes?: string;
}

export interface WorkoutFilters {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const workoutService = {
  // Create new workout
  createWorkout: async (token: string, workoutData: CreateWorkoutRequest) => {
    return await apiCall('/workout', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(workoutData)
    });
  },

  // Get user's workouts with filters
  getUserWorkouts: async (token: string, filters: WorkoutFilters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/workout?${queryString}` : '/workout';

    return await apiCall(endpoint, {
      headers: getAuthHeaders(token)
    });
  },

  // Get specific workout by ID
  getWorkout: async (token: string, workoutId: string) => {
    return await apiCall(`/workout/${workoutId}`, {
      headers: getAuthHeaders(token)
    });
  },

  // Update workout
  updateWorkout: async (token: string, workoutId: string, workoutData: UpdateWorkoutRequest) => {
    return await apiCall(`/workout/${workoutId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(workoutData)
    });
  },

  // Delete workout
  deleteWorkout: async (token: string, workoutId: string) => {
    return await apiCall(`/workout/${workoutId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
  },

  // Start workout (update status to in_progress)
  startWorkout: async (token: string, workoutId: string) => {
    return await apiCall(`/workout/${workoutId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ status: 'in_progress' })
    });
  },

  // Complete workout (update status to completed)
  completeWorkout: async (token: string, workoutId: string, duration: number, notes?: string) => {
    return await apiCall(`/workout/${workoutId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ 
        status: 'completed', 
        duration, 
        notes 
      })
    });
  }
};
