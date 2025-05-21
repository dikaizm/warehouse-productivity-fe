import { User, UserAuth } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Auth context type
type AuthContextType = {
  user: UserAuth | null;
  setUser: (user: UserAuth | null) => void;
  loading: boolean;
  login: (userData: UserAuth) => void;
  logout: () => void;
  updateUser: (userData: Partial<UserAuth>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        // Try to get user from localStorage
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            
            // Optionally verify token with backend
            // const response = await fetch('/api/verify-token', {
            //   headers: { Authorization: `Bearer ${parsedUser.token}` }
            // });
            // if (!response.ok) throw new Error('Token invalid');
          } catch (parseError) {
            console.error('Failed to parse stored user data:', parseError);
            localStorage.removeItem('user');
            await fetchUserFromAPI();
          }
        } else {
          await fetchUserFromAPI();
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserFromAPI = async () => {
      try {
        const response = await fetch('/api/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          // User is not authenticated
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        setUser(null);
        localStorage.removeItem('user');
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = (userData: UserAuth) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Optionally call logout API
    // fetch('/api/logout', { method: 'POST' });
  };

  // Update user function
  const updateUser = (userData: Partial<UserAuth>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading,
      login,
      logout, 
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};