"use client";

import {
  mockLogin,
  mockRegister,
  mockResetPassword,
} from "../utils/auth-service";
import { AuthContext } from "./auth-context";
import { useState, useEffect } from "react";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem("user");
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const userData = await mockLogin(email, password);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.log("login failed", "error");
      throw error;
    }
  };

  // Register function
  const register = async (email, password) => {
    try {
      const userData = await mockRegister(email, password);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.log("register failed", "error");
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Reset password function
  const resetPassword = async (email) => {
    return await mockResetPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}
