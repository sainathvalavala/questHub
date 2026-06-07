import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Set base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || "";
axios.defaults.baseURL = API_BASE_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync token with axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user session:", err);
        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (username, email, password) => {
    setError(null);
    try {
      const res = await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  // Helper to manually update points locally in global state
  const updatePoints = (amount) => {
    if (user) {
      setUser((prev) => ({
        ...prev,
        points: (prev.points || 0) + amount,
      }));
    }
  };

  // Helper to update user stats locally
  const updateStats = (statName, amount) => {
    if (user) {
      setUser((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          [statName]: (prev.stats?.[statName] || 0) + amount,
        },
      }));
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updatePoints,
    updateStats,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
