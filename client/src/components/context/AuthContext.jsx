/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import logger from "../../utils/logger";
import { useFlashMessage } from "./FlashMessageContext";
import LoadingOverlay from "../layout/LoadingOverlay";

/**
 * Authentication context for managing user session state, access tokens,
 * refresh logic, and login/logout operations throughout the application.
 *
 * @typedef {Object} AuthContextValue
 * @property {Object|null} user - The authenticated user's data (id, email, username, profile).
 * @property {string|null} accessToken - The current JWT access token stored in memory.
 * @property {boolean} loading - Whether authentication state is being initialized or refreshed.
 * @property {Function} login - Logs in a user and stores their token and expiry.
 * @property {Function} logout - Logs out the user and clears all auth state.
 * @property {boolean} isAuthenticated - True if a user object is present.
 */

const AuthContext = createContext(null);

/**
 * Provides authentication state and actions to the application.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Components that should have access to authentication state.
 * @returns {JSX.Element} AuthProvider component wrapping the application.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const expiresIn = useRef(null);
  const tokenExpirationTimestamp = useRef(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const { setFlashMessage } = useFlashMessage();
  const [isLoggedOut, setIsLoggedOut] = useState(false); // Track if user has logged out

  //token state
  const [tokenExpiration, setTokenExpiration] = useState(null);

  /**
   * Logs out the user by clearing all authentication-related state.
   *
   * @returns {void}
   */
  const logout = useCallback(() => {
    try {
      axios.post(
        `${API_BASE_URL}/account/logout`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setIsLoggedOut(true);
    } catch (err) {
      logger("error", "Logout error:", err);
    }
    setAccessToken(null);
    setUser(null);
  }, [setAccessToken, setUser, accessToken]);

  /**
   * Attempts to refresh the user's access token using the HTTP-only refresh token cookie.
   * If successful, updates access token, expiry, and fetches the authenticated user's data.
   * If refresh fails, logs out the user.
   *
   * @returns {Promise<void>}
   */
  const refreshToken = useCallback(async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/account/refreshToken`,
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.success && res.data.token) {
        setAccessToken(res.data.token);

        // Fetch user info with new access token
        const userRes = await axios.get(`${API_BASE_URL}/account/me`, {
          headers: { Authorization: `Bearer ${res.data.token}` },
          withCredentials: true,
        });

        setUser(userRes.data.user);

        const refreshedExpiresIn = Number(res.data.expiresIn) || 900;
        expiresIn.current = refreshedExpiresIn;
        tokenExpirationTimestamp.current =
          Date.now() + expiresIn.current * 1000;

        setTokenExpiration(tokenExpirationTimestamp.current);
      }
    } catch (err) {
      const noRefreshTokenPresent =
        err?.response?.status === 401 &&
        /refresh token/i.test(
          err?.response?.data?.message || err?.response?.data?.error || "",
        );

      if (!isLoggedOut && !noRefreshTokenPresent) {
        logger("warning", "Token refresh failed:", err);
        setFlashMessage("Session expired, please log in again.");
      } else if (!isLoggedOut) {
        logger(
          "info",
          "No refresh token present or user is unauthenticated; skipping flash.",
        );
      } else {
        logger("info", "User has logged out, skipping token refresh.");
      }
      logout();
    }
  }, [logout, setFlashMessage, isLoggedOut]);

  /**
   * Runs once on app load to verify the user's session using the refresh token cookie.
   * Avoids storing access tokens in Storage for security.
   *
   * @returns {Promise<void>}
   */
  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);

      try {
        await refreshToken();
      } catch (err) {
        logger("warning", "user Error : ", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [refreshToken, logout]);

  useEffect(() => {
    if (!tokenExpiration) return;

    const now = Date.now();
    const timeUntilExpire = tokenExpiration - now;
    const refreshTime = timeUntilExpire - 30000; // refresh 30s early

    let timer;

    if (refreshTime <= 0) {
      // Token is expiring soon or already expired → refresh immediately
      try {
        refreshToken();
      } catch (err) {
        logger("warning", "failed to authorize account", err);
        logout();
      }
    } else {
      // Schedule the refresh
      timer = setTimeout(() => {
        try {
          refreshToken();
        } catch (err) {
          logger("warning", "failed to authorize account", err);
          logout();
        }
      }, refreshTime);
    }

    return () => clearTimeout(timer);
  }, [tokenExpiration, logout, refreshToken]);

  /**
   * Logs in a user by storing their user object, access token, and expiry timestamp.
   *
   * @param {Object} user - The authenticated user's data (must contain tokenExpiry property).
   * @param {string} token - The JWT access token.
   * @returns {void}
   */
  const login = (user, token, expiresInSeconds = null) => {
    setAccessToken(token);
    setUser(user);
    setIsLoggedOut(false);

    const effectiveExpiresIn =
      Number(expiresInSeconds ?? user?.tokenExpiry ?? 900) || 900;

    expiresIn.current = effectiveExpiresIn;
    tokenExpirationTimestamp.current =
      Date.now() + expiresIn.current * 1000;

    setTokenExpiration(tokenExpirationTimestamp.current);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAuthorized: !loading && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook for accessing authentication state and actions.
 *
 * @returns {AuthContextValue} The authentication context value.
 */
export const useAuth = () => useContext(AuthContext);

export const useAuthGuard = ({
  redirectPath = "/login",
  pendingMessage = "One moment please, we are verifying your account...",
  redirectMessage = "Redirected for account safety",
} = {}) => {
  const { loading, isAuthorized } = useAuth();
  const navigate = useNavigate();
  const { setFlashMessage } = useFlashMessage();
  const messageShownRef = useRef(false);

  return useCallback(() => {
    if (loading) {
      if (!messageShownRef.current) {
        setFlashMessage(pendingMessage);
        messageShownRef.current = true;
      }
      return false;
    }

    if (!isAuthorized) {
      if (!messageShownRef.current) {
        setFlashMessage(redirectMessage);
        messageShownRef.current = true;
      }
      navigate(redirectPath, { replace: true });
      return false;
    }

    return true;
  }, [
    loading,
    isAuthorized,
    navigate,
    setFlashMessage,
    pendingMessage,
    redirectMessage,
    redirectPath,
  ]);
};

export const AuthGuard = ({
  children,
  redirectPath = "/login",
  pendingMessage = "One moment please, we are verifying your account...",
  redirectMessage = "Redirected for account safety",
}) => {
  const { loading, isAuthorized } = useAuth();
  const navigate = useNavigate();
  const { setFlashMessage } = useFlashMessage();
  const redirectShownRef = useRef(false);
  const [flashFailed, setFlashFailed] = useState(false);
  const messageShownRef = useRef(false);

  const tryFlash = useCallback(
    (message) => {
      if (flashFailed) {
        return false;
      }

      try {
        setFlashMessage(message);
        return true;
      } catch (err) {
        logger("error", "FlashMessage failed:", err);
        setFlashFailed(true);
        return false;
      }
    },
    [flashFailed, setFlashMessage],
  );

  useEffect(() => {
    if (loading && !messageShownRef.current) {
      const timer = setTimeout(() => {
        tryFlash(pendingMessage);
      });

      messageShownRef.current = true;

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [loading, pendingMessage, tryFlash]);

  useEffect(() => {
    if (!loading && !isAuthorized && !redirectShownRef.current) {
      const timer = setTimeout(() => {
        tryFlash(redirectMessage);
        navigate(redirectPath, { replace: true });
      });

      redirectShownRef.current = true;

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [
    loading,
    isAuthorized,
    navigate,
    redirectPath,
    redirectMessage,
    tryFlash,
  ]);

  if (loading) {
    return (
      <LoadingOverlay message={flashFailed ? pendingMessage : "Loading..."} />
    );
  }

  if (!isAuthorized) {
    return (
      <LoadingOverlay
        message={flashFailed ? redirectMessage : "Redirecting..."}
      />
    );
  }

  return <>{children}</>;
};
