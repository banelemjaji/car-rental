import { createContext, useState, useContext, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiryTime, setTokenExpiryTime] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage on app load
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      
      // Add token to axios default headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Set token expiry if available
      if (expiry) {
        setTokenExpiryTime(parseInt(expiry, 10));
      }
    }
    
    setLoading(false);
  }, []);

  // Set up token refresh
  useEffect(() => {
    if (!tokenExpiryTime) return;

    const currentTime = Date.now();
    const timeUntilExpiry = tokenExpiryTime - currentTime;
    
    // If token is already expired, log out
    if (timeUntilExpiry <= 0) {
      logout();
      return;
    }
    
    // Set up refresh 5 minutes before expiry
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 1000);
    
    const refreshTimer = setTimeout(async () => {
      try {
        const response = await api.post("/api/auth/refresh-token");
        const { accessToken, expiresAt } = response.data;
        
        // Update token in storage and headers
        localStorage.setItem("token", accessToken);
        localStorage.setItem("tokenExpiry", expiresAt);
        
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        setTokenExpiryTime(expiresAt);
      } catch (err) {
        console.error("Token refresh failed:", err);
        logout();
      }
    }, refreshTime);
    
    // Clean up timer on unmount
    return () => clearTimeout(refreshTimer);
  }, [tokenExpiryTime]);

  // Login user
  const login = (userData, token, expiresAt) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    
    // Store token expiry time if provided
    if (expiresAt) {
      localStorage.setItem("tokenExpiry", expiresAt);
      setTokenExpiryTime(expiresAt);
    }
    
    // Set token in axios headers
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Logout user
  const logout = async () => {
    try {
      // Call logout API
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      setTokenExpiryTime(null);
    }
  };

  // Check if user has admin role
  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 