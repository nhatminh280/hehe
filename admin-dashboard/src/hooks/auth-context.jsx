"use client";

import { createContext, useContext } from "react";

// Tạo context cho authentication
export const AuthContext = createContext(null);

// Hook để sử dụng auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

