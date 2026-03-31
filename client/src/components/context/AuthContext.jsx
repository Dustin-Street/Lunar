import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import logger from "../../utils/logger";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(null);

  // Verify user on app load
  useEffect(() => {
    verifyUser();
  }, []);

  const verifyUser = async () => {
    setLoading(true);

    try {
      // Try to rehydrate user from refresh token cookie only;
      // avoid storing access token in localStorage.
      await refreshToken();
    } catch (err) {
      logger.warn("verifyUser failed:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/account/refreshToken`,
        {},
        { withCredentials: true }
      );

      if (res.data.success && res.data.token) {
        setAccessToken(res.data.token);
        setTokenExpiry(Date.now() + res.data.expiresIn * 1000);

        // Get user info with new token
        const userRes = await axios.get(
          `${API_BASE_URL}/account/me`,
          {
            headers: { Authorization: `Bearer ${res.data.token}` },
            withCredentials: true
          }
        );
        setUser(userRes.data.user);
      }
    } catch (err) {
      logger.error("Refresh token failed:", err);
      // Refresh token failed or expired - clear everything
      logout();
    }
  };

  const login = (user, token, expiresIn) => {
    setAccessToken(token);  // Memory only, no localStorage
    setTokenExpiry(Date.now() + expiresIn * 1000);  // Calculate expiry timestamp
    setUser(user);// save user data for context API calls
  };

  const logout = () => {
    setAccessToken(null);
    setTokenExpiry(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);