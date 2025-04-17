"use client";

import { createContext, useContext } from "react";

// Tạo context cho toast notifications
export const ToastContext = createContext(null);

// Hook để sử dụng toast context
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
