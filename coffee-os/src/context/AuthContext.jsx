import { createContext, useState, useEffect } from "react";
import { loginUser, signupUser } from "../api/authService";

export const AuthContext = createContext();

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
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
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
    } catch (error) {
      console.error("Login error:", error);
      throw error;
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
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
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
