import { STORAGE_KEYS } from "@/lib/constants";
import { UserAuth } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Auth context type
type AuthContextType = {
  user: UserAuth | null;
  setUser: (user: UserAuth | null) => void;
  loading: boolean;
  login: (userData: UserAuth, tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user state as null, we'll load it in useEffect
  const [user, setUserState] = useState<UserAuth | null>(null);
  const [loading, setLoading] = useState(true);

  // Custom setUser that also updates localStorage
  const setUser = (newUser: UserAuth | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        }
        return data.accessToken;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return null;
    }
  };

  // Load user on mount
  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      if (!mounted) return;

      try {
        setLoading(true);
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

        // If no tokens, clear everything and return
        if (!accessToken || !refreshToken) {
          if (mounted) {
            setUser(null);
          }
          return;
        }

        // If we have stored user data, set it immediately
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (mounted) {
              setUserState(parsedUser);
            }
          } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem(STORAGE_KEYS.USER);
          }
        }

        try {
          // Try to get fresh user data
          const response = await fetch(`${API_URL}/api/users/me`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          if (!mounted) return;

          if (response.ok) {
            const userData = await response.json();
            setUser(userData.data);
          } else if (response.status === 401) {
            // Access token expired, try to refresh
            const newAccessToken = await refreshAccessToken();
            if (!mounted) return;

            if (newAccessToken) {
              // Retry with new access token
              const retryResponse = await fetch(`${API_URL}/api/users/me`, {
                headers: {
                  'Authorization': `Bearer ${newAccessToken}`
                }
              });

              if (!mounted) return;

              if (retryResponse.ok) {
                const userData = await retryResponse.json();
                setUser(userData.data);
              } else {
                throw new Error('Failed to get user data after token refresh');
              }
            } else {
              throw new Error('Failed to refresh token');
            }
          } else {
            throw new Error('Failed to get user data');
          }
        } catch (error) {
          console.error('Error loading user:', error);
          if (mounted) {
            setUser(null);
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array since we only want to run this on mount

  // Login function
  const login = (userData: UserAuth, tokens: { accessToken: string; refreshToken: string }) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      login,
      logout,
      refreshAccessToken,
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