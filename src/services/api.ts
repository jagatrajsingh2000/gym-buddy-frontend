// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
