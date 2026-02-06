import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";


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
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5050/account/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      setUser(res.data.user);
    } catch (err) {
      // token expired → try refresh
      await refreshToken();
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5050/account/refreshToken",
        {},
        { withCredentials: true }
      );

      if (res.data.success && res.data.token) {
        setAccessToken(res.data.token);
        setTokenExpiry(Date.now() + res.data.expiresIn * 1000);

        // Get user info with new token
        const userRes = await axios.get(
          "http://localhost:5050/account/me",
          {
            headers: { Authorization: `Bearer ${res.data.token}` },
            withCredentials: true
          }
        );
        setUser(userRes.data.user);
      }
    } catch (err) {
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