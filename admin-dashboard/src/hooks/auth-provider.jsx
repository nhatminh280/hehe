"use client";

import { useToast } from "../components/toast-context";
import { AuthService, TokenService } from "../utils/auth-service";
import { AuthContext } from "./auth-context";
import { useState, useEffect } from "react";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Kiểm tra xem có token không
        if (TokenService.getToken()) {
          // Lấy thông tin người dùng từ API
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
          // return userData;
        }
      } catch (error) {
        console.error("Failed to get user data:", error);
        // Nếu có lỗi, xóa token
        TokenService.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Đăng nhập
  const login = async (email, password) => {
    setLoading(true);
    try {
      const userData = await AuthService.login(email, password);
      setUser(userData);
      addToast("Đăng nhập thành công!", "success");

      return userData;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.";
      addToast(errorMessage, "error");
      // Xử lý lỗi ở đây thay vì re-throw
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Đăng ký
  const register = async (email, password) => {
    setLoading(true);
    try {
      const userData = await AuthService.register(email, password);
      setUser(userData);
      addToast("Đăng ký thành công!", "success");
      return userData;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      addToast(errorMessage, "error");
      // Xử lý lỗi ở đây thay vì re-throw
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      addToast("Đã đăng xuất thành công!", "info");
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn xử lý logout ở client side ngay cả khi API thất bại
      setUser(null);
      TokenService.clearTokens();
      addToast("Đã đăng xuất, nhưng có lỗi xảy ra với server", "warning");
    } finally {
      setLoading(false);
    }
  };

  // Đặt lại mật khẩu
  const resetPassword = async (email) => {
    setLoading(true);
    try {
      await AuthService.resetPassword(email);
      addToast("Hướng dẫn đặt lại mật khẩu đã được gửi!", "success");
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.";
      addToast(errorMessage, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xác minh mã code đặt lại mật khẩu
  const verifyResetCode = async (email, code) => {
    setLoading(true);
    try {
      await AuthService.verifyResetCode(email, code);
      addToast("Mã xác nhận hợp lệ", "success");
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Mã xác nhận không hợp lệ. Vui lòng thử lại.";
      addToast(errorMessage, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Đặt mật khẩu mới
  const setNewPassword = async (email, code, newPassword) => {
    setLoading(true);
    try {
      await AuthService.setNewPassword(email, code, newPassword);
      addToast(
        "Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.",
        "success"
      );
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Không thể đặt lại mật khẩu. Vui lòng thử lại.";
      addToast(errorMessage, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        resetPassword,
        verifyResetCode,
        setNewPassword,
        isAuthenticated: AuthService.isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
