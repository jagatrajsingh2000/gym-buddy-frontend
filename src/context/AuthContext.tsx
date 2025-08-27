import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  updateProfile: (profileData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Restore user from localStorage on mount
  const restoreUserFromStorage = async () => {
    const savedToken = localStorage.getItem('token');
    
    if (savedToken) {
      try {
        // Verify token with backend and get user profile
        const response = await authService.getProfile(savedToken);
        if (response.success && response.data) {
          setUser(response.data);
          setToken(savedToken);
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    restoreUserFromStorage();
  }, []);

  // Login function using real API
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        return true;
      } else {
        console.error('Login failed:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    if (token) {
      try {
        const response = await authService.logout(token);
        if (response.success && response.data) {
          console.log('Logout successful:', {
            logoutTime: response.data.logoutTime,
            tokenInvalidated: response.data.tokenInvalidated
          });
        } else {
          console.warn('Logout warning:', response.message);
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Always clear local state regardless of API response
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  // Register function using real API
  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authService.register({
        email: userData.email || '',
        password: userData.password,
        userType: (userData.userType as 'client' | 'trainer' | 'gym') || 'client',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || undefined,
        dateOfBirth: userData.dateOfBirth || undefined,
        gender: userData.gender || undefined,
        height: userData.height || undefined,
        heightUnit: userData.heightUnit || undefined
      });
      
      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        return true;
      } else {
        console.error('Registration failed:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (profileData: any): Promise<boolean> => {
    if (!token) return false;
    
    try {
      const response = await authService.updateProfile(token, profileData);
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
