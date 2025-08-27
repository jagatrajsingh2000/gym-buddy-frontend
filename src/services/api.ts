// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}


export const api = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Helper function to get auth headers
export const getAuthHeaders = (token: string) => ({
  ...api.headers,
  'Authorization': `Bearer ${token}`
});

// Helper function for API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${api.baseURL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...api.headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      // For non-200 responses, try to parse error data
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      
      // Throw error for backward compatibility with existing services
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Return data directly for backward compatibility
  } catch (error) {
    console.error('API call failed:', error);
    throw error; // Re-throw for backward compatibility
  }
};
