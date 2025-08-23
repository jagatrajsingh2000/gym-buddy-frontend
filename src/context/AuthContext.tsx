import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService, User } from '../services/authService';
import { validateDemoCredentials, DemoUser } from '../data/demoCredentials';

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
  const [loading, setLoading] = useState(false);

  // Load user profile when token exists
  useEffect(() => {
    const loadUserProfile = async () => {
      if (token) {
        try {
          setLoading(true);
          
          // Check if this is a demo user first
          const demoUser = localStorage.getItem('demo_user');
          if (demoUser && token.startsWith('demo_token_')) {
            setUser(JSON.parse(demoUser));
            setLoading(false);
            return;
          }
          
          // Otherwise, load from API
          const response = await authService.getProfile(token);
          if (response.success) {
            setUser(response.data);
          } else {
            // Token might be expired, remove it
            localStorage.removeItem('token');
            localStorage.removeItem('demo_user');
            setToken(null);
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('demo_user');
          setToken(null);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserProfile();
  }, [token]);

  // Login function with demo credentials fallback
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Check for demo credentials first
      const demoUser = validateDemoCredentials(email, password);
      if (demoUser) {
        // Use demo user data
        const mockToken = `demo_token_${demoUser.profile.id}_${Date.now()}`;
        const user: User = {
          id: demoUser.profile.id,
          email: demoUser.email,
          userType: demoUser.userType,
          firstName: demoUser.profile.firstName,
          lastName: demoUser.profile.lastName,
          phone: '',
          dateOfBirth: null,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setToken(mockToken);
        setUser(user);
        localStorage.setItem('token', mockToken);
        localStorage.setItem('demo_user', JSON.stringify(user));
        return true;
      }

      // Fallback to real API
      const response = await authService.login({ email, password });
      if (response.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        localStorage.removeItem('demo_user'); // Clear demo data
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
    if (token && !token.startsWith('demo_token_')) {
      try {
        await authService.logout(token);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('demo_user');
  };

  // Register function using real API
  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authService.register({
        email: userData.email || '',
        password: userData.password,
        userType: userData.userType || 'client',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || undefined
      });
      
      if (response.success) {
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
      if (response.success) {
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
