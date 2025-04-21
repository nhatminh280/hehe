import axios from "axios";
import Cookies from "js-cookie";

// Cấu hình Axios
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// Tạo instance Axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Tên cookies
const TOKEN_COOKIE_NAME = "jwt";
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

// Thời gian hết hạn cookies (7 ngày)
const TOKEN_EXPIRY = 7;

// Quản lý token trong cookies
const TokenService = {
  // Lưu token vào cookies
  setToken: (token) => {
    Cookies.set(TOKEN_COOKIE_NAME, token, {
      expires: TOKEN_EXPIRY,
      secure: import.meta.env.MODE === "production",
      httpOnly: true,
    });
  },

  // Lấy token từ cookies
  getToken: () => {
    return Cookies.get(TOKEN_COOKIE_NAME);
  },

  // Xóa token khỏi cookies
  removeToken: () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
  },

  // Lưu refresh token vào cookies
  setRefreshToken: (token) => {
    Cookies.set(REFRESH_TOKEN_COOKIE_NAME, token, {
      expires: TOKEN_EXPIRY,
      secure: false,
    });
  },

  // Lấy refresh token từ cookies
  getRefreshToken: () => {
    return Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
  },

  // Xóa refresh token khỏi cookies
  removeRefreshToken: () => {
    Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
  },

  // Xóa tất cả token
  clearTokens: () => {
    TokenService.removeToken();
    TokenService.removeRefreshToken();
  },
};

// Thêm interceptor để tự động thêm token vào header của mỗi request
api.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi 401 (Unauthorized) và tự động refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thử refresh token
        const refreshToken = TokenService.getRefreshToken();
        if (!refreshToken) {
          // Nếu không có refresh token, đăng xuất người dùng
          TokenService.clearTokens();
          return Promise.reject(error);
        }

        // Gọi API refresh token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        // Lưu token mới
        const { token, refreshToken: newRefreshToken } = response.data;
        TokenService.setToken(token);
        TokenService.setRefreshToken(newRefreshToken);

        // Thực hiện lại request ban đầu với token mới
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, đăng xuất người dùng
        TokenService.clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Các hàm xác thực
const AuthService = {
  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      const { token, role } = response.data.body;
      console.log("Received token:", token);
      console.log(response.data);

      // Lưu token vào cookies
      TokenService.setToken(token);
      console.log("Token stored:", TokenService.getToken());

      return role;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Đăng ký
  register: async (email, password) => {
    try {
      const response = await api.post("/users/create-user", {
        email,
        password,
      });
      const { token, role } = response.data.body;

      // Lưu token vào cookies
      TokenService.setToken(token);

      return role;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  // Đăng xuất
  logout: () => {
    try {
      // Gọi API đăng xuất (nếu backend yêu cầu)
      api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Xóa token khỏi cookies
      TokenService.clearTokens();
    }
  },

  // Gửi yêu cầu đặt lại mật khẩu
  resetPassword: async (email) => {
    try {
      const response = await api.post(`/auth/forgot-password?email=${email}`);
      return response.data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },

  // Xác minh mã code đặt lại mật khẩu
  verifyResetCode: async (email, code) => {
    try {
      const response = await api.get(`/verify/confirm?token=${code}`, {
        email,
        code,
      });
      // console.log(response.data.message);
      return response.data;
    } catch (error) {
      console.error("Verify reset code error:", error);
      throw error;
    }
  },

  // Đặt mật khẩu mới
  setNewPassword: async (email, newPassword, confirmPassword) => {
    try {
      const response = await api.put("/auth/reset-password", {
        email,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Set new password error:", error);
      throw error;
    }
  },

  // Kiểm tra trạng thái đăng nhập
  getCurrentUser: async () => {
    try {
      const response = await api.get("/users/user-info");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },

  //Kiểm tra xem người dùng đã đăng nhập chưa
  isAuthenticated: () => {
    return !!TokenService.getToken();
  },
};

export { AuthService, TokenService, api };
