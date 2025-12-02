import { useState, useEffect } from "react";
import { loginUser, signupUser } from "../api/authService";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      const userToStore = {
        ...response.user,
        token: response.token,
      };

      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);
      return userToStore;
    } catch {
      //ignore
    }
  };

  const signup = async (username, fullName, email, password) => {
    try {
      const response = await signupUser(username, fullName, email, password);
      if (response.token) {
        const userToStore = {
          ...response.user,
          token: response.token,
        };
        localStorage.setItem("user", JSON.stringify(userToStore));
        setUser(userToStore);
      }
      return response;
    } catch {
      // ignore
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
