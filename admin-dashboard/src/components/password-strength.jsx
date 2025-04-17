"use client";

import { useState, useEffect } from "react";

export default function PasswordStrength({ password }) {
  const [strength, setStrength] = useState({ score: 0, label: "" });

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, label: "" });
      return;
    }

    // Calculate password strength
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Determine strength label
    let label = "";
    if (score <= 2) label = "weak";
    else if (score <= 4) label = "medium";
    else label = "strong";

    setStrength({ score, label });
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-1">
      <div className={`password-strength-indicator ${strength.label}`}></div>
      <div className="flex justify-between text-xs mt-1">
        <span
          className={
            strength.label === "weak"
              ? "text-red-500 font-medium"
              : "text-gray-400"
          }
        >
          Yếu
        </span>
        <span
          className={
            strength.label === "medium"
              ? "text-yellow-500 font-medium"
              : "text-gray-400"
          }
        >
          Trung bình
        </span>
        <span
          className={
            strength.label === "strong"
              ? "text-green-500 font-medium"
              : "text-gray-400"
          }
        >
          Mạnh
        </span>
      </div>
    </div>
  );
}
