import { useEffect, useState } from "react";
import { apiClient, getApiErrorMessage, setAuthToken } from "../lib/api";
import { hasUserPermission } from "../lib/permissions";
import { AuthContext } from "./authContextDefinition";

const TOKEN_STORAGE_KEY = "prism-grid-auth-token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    if (!token) {
      setAuthToken(null);
      setUser(null);
      setIsBootstrapping(false);
      return;
    }

    setAuthToken(token);

    let isActive = true;

    apiClient
      .get("/auth/me")
      .then((response) => {
        if (!isActive) {
          return;
        }

        setUser(response.data.user);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setAuthToken(null);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (isActive) {
          setIsBootstrapping(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  const persistSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const register = async (payload) => {
    try {
      const response = await apiClient.post("/auth/register", payload);
      persistSession(response.data.token, response.data.user);
      return response.data.user;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to create account."));
    }
  };

  const login = async (payload) => {
    try {
      const response = await apiClient.post("/auth/login", payload);
      persistSession(response.data.token, response.data.user);
      return response.data.user;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to log in."));
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiClient.post("/auth/logout");
      }
    } catch {
      // A failed logout request should not keep the client session alive.
    } finally {
      clearSession();
    }
  };

  const refreshCurrentUser = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await apiClient.get("/auth/me");
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      clearSession();
      throw new Error(getApiErrorMessage(error, "Unable to refresh session."));
    }
  };

  const updateProfile = async (payload) => {
    try {
      const response = await apiClient.patch("/users/me", payload);
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to update profile."));
    }
  };

  const updatePreferences = async (payload) => {
    try {
      const response = await apiClient.patch("/users/me/preferences", payload);
      setUser((currentUser) => ({
        ...currentUser,
        preferences: response.data.preferences,
      }));
      return response.data.preferences;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to update preferences."));
    }
  };

  const changePassword = async (payload) => {
    try {
      const response = await apiClient.post("/auth/change-password", payload);
      return response.data.message;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to update password."));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isBootstrapping,
        hasPermission: (permission) => hasUserPermission(user, permission),
        register,
        login,
        logout,
        refreshCurrentUser,
        updateProfile,
        updatePreferences,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
