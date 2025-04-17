"use client";

import { ToastContext } from "./toast-context";
import { X, Check, AlertTriangle, Info } from "lucide-react";
import { useState, useCallback } from "react";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "success", duration = 5000) => {
      const id = Date.now();

      setToasts((prev) => [...prev, { id, message, type, duration }]);

      if (duration !== Number.POSITIVE_INFINITY) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded shadow-lg flex items-start max-w-xs animate-slide-up ${
              toast.type === "success"
                ? "bg-green-50 border-l-4 border-green-500"
                : toast.type === "error"
                ? "bg-red-50 border-l-4 border-red-500"
                : toast.type === "warning"
                ? "bg-yellow-50 border-l-4 border-yellow-500"
                : "bg-blue-50 border-l-4 border-blue-500"
            }`}
          >
            <div
              className={`mr-3 mt-0.5 ${
                toast.type === "success"
                  ? "text-green-500"
                  : toast.type === "error"
                  ? "text-red-500"
                  : toast.type === "warning"
                  ? "text-yellow-500"
                  : "text-blue-500"
              }`}
            >
              {toast.type === "success" ? (
                <Check size={18} />
              ) : toast.type === "error" ? (
                <AlertTriangle size={18} />
              ) : toast.type === "warning" ? (
                <AlertTriangle size={18} />
              ) : (
                <Info size={18} />
              )}
            </div>
            <div>
              <h3
                className={`font-medium ${
                  toast.type === "success"
                    ? "text-green-800"
                    : toast.type === "error"
                    ? "text-red-800"
                    : toast.type === "warning"
                    ? "text-yellow-800"
                    : "text-blue-800"
                }`}
              >
                {toast.type === "success"
                  ? "Thành công!"
                  : toast.type === "error"
                  ? "Lỗi!"
                  : toast.type === "warning"
                  ? "Cảnh báo!"
                  : "Thông báo!"}
              </h3>
              <p
                className={`text-sm ${
                  toast.type === "success"
                    ? "text-green-700"
                    : toast.type === "error"
                    ? "text-red-700"
                    : toast.type === "warning"
                    ? "text-yellow-700"
                    : "text-blue-700"
                }`}
              >
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-auto ${
                toast.type === "success"
                  ? "text-green-500 hover:text-green-700"
                  : toast.type === "error"
                  ? "text-red-500 hover:text-red-700"
                  : toast.type === "warning"
                  ? "text-yellow-500 hover:text-yellow-700"
                  : "text-blue-500 hover:text-blue-700"
              }`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
