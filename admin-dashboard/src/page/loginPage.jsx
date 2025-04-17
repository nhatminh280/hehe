"use client";

import { useAuth } from "../hooks/auth-context";
import PasswordStrength from "@/components/password-strength";
import { useToast } from "@/components/toast-context";
import {
  X,
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { login, register, resetPassword } = useAuth();

  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [isModalTransitioning, setIsModalTransitioning] = useState(false);

  // Form visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Focus states
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [resetEmailFocus, setResetEmailFocus] = useState(false);

  // Form data
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  // Form validation
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [resetErrors, setResetErrors] = useState({});
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  //login

  // Modal handling functions
  const openLoginModal = () => {
    setIsModalTransitioning(true);
    setShowLoginModal(true);
    setShowRegisterModal(false);
    setShowForgotPasswordModal(false);
    setShowResetConfirmation(false);
    resetFormErrors();
  };

  const openRegisterModal = () => {
    setIsModalTransitioning(true);
    setShowRegisterModal(true);
    setShowLoginModal(false);
    setShowForgotPasswordModal(false);
    setShowResetConfirmation(false);
    resetFormErrors();
  };

  const openForgotPasswordModal = () => {
    setIsModalTransitioning(true);
    setShowForgotPasswordModal(true);
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowResetConfirmation(false);
    resetFormErrors();
  };

  const closeModals = () => {
    setIsModalTransitioning(true);
    setTimeout(() => {
      setShowLoginModal(false);
      setShowRegisterModal(false);
      setShowForgotPasswordModal(false);
      setShowResetConfirmation(false);
      setIsModalTransitioning(false);
      resetFormErrors();
    }, 300);
  };

  const resetFormErrors = () => {
    setLoginErrors({});
    setRegisterErrors({});
    setResetErrors({});
  };

  // Form validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Form submission handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoginSubmitting(true);

    // Reset errors
    const errors = {};

    // Validate email
    if (!loginEmail) {
      errors.email = "Email là bắt buộc";
    } else if (!validateEmail(loginEmail)) {
      errors.email = "Email không hợp lệ";
    }

    // Validate password
    if (!loginPassword) {
      errors.password = "Mật khẩu là bắt buộc";
    }

    // If there are errors, display them
    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      setIsLoginSubmitting(false);
      return;
    }

    try {
      await login(loginEmail, loginPassword);
      closeModals();
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      addToast(
        "Không đăng nhập thành công . Vui lòng kiểm tra đăng nhập lại. ",
        "error"
      );
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsRegisterSubmitting(true);

    // Reset errors
    const errors = {};

    // Validate email
    if (!registerEmail) {
      errors.email = "Email là bắt buộc";
    } else if (!validateEmail(registerEmail)) {
      errors.email = "Email không hợp lệ";
    }

    // Validate password
    if (!registerPassword) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (!validatePassword(registerPassword)) {
      errors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    // Validate confirm password
    if (!confirmPassword) {
      errors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (confirmPassword !== registerPassword) {
      errors.confirmPassword = "Mật khẩu không khớp";
    }

    // If there are errors, display them
    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      setIsRegisterSubmitting(false);
      return;
    }

    try {
      await register(registerEmail, registerPassword);
      closeModals();
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      addToast("Đăng ký không thành công. Vui lòng thử lại.", "error");
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsResetSubmitting(true);

    // Reset errors
    const errors = {};

    // Validate email
    if (!resetEmail) {
      errors.email = "Email là bắt buộc";
    } else if (!validateEmail(resetEmail)) {
      errors.email = "Email không hợp lệ";
    }

    // If there are errors, display them
    if (Object.keys(errors).length > 0) {
      setResetErrors(errors);
      setIsResetSubmitting(false);
      return;
    }

    try {
      await resetPassword(resetEmail);
      setShowResetConfirmation(true);
      setShowForgotPasswordModal(false);
    } catch (error) {
      console.error("Password reset failed:", error);
      addToast(
        "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setIsResetSubmitting(false);
    }
  };

  useEffect(() => {
    if (
      showLoginModal ||
      showRegisterModal ||
      showForgotPasswordModal ||
      showResetConfirmation
    ) {
      document.body.classList.add("overflow-hidden");
      setTimeout(() => setIsModalTransitioning(false), 50);
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [
    showLoginModal,
    showRegisterModal,
    showForgotPasswordModal,
    showResetConfirmation,
  ]);

  // Helper component for error message
  const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
      <div className="flex items-center mt-1 text-red-500 text-sm">
        <AlertTriangle size={14} className="mr-1" />
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-100 rounded-full translate-x-1/2 opacity-50"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-100 rounded-full translate-y-1/2 opacity-40"></div>
      </div>

      {/* Logo */}
      <div className="w-full max-w-md mb-8 relative z-10 flex justify-center">
        <div className="text-3xl font-bold text-[#0071f9] flex items-center">
          <span className="bg-[#0071f9] text-white px-3 py-1 rounded-lg mr-2">
            ET
          </span>
          <span>Enghub</span>
        </div>
      </div>

      <div className="max-w-md w-full text-center mb-8 relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-[#152946] mb-2">
          Tham gia ngay cùng Enghub
        </h1>
        <h2 className="text-lg text-[#0071f9] font-medium mb-4">
          Nền tảng học và luyện thi thông minh , trực tuyến tốt nhất hiện nay
        </h2>
        {/* <p className="text-sm text-gray-600 mt-4">
          Bằng cách tham gia, chúng tôi xác nhận bạn đã đọc và đồng ý với{" "}
          <a href="#" className="text-[#0071f9] hover:underline transition-all">
            Điều kiện & Điều khoản
          </a>{" "}
          cùng{" "}
          <a href="#" className="text-[#0071f9] hover:underline transition-all">
            Chính sách bảo mật
          </a>{" "}
          của Enghub
        </p> */}

        <div className="flex flex-col w-full max-w-xs mx-auto gap-3 mt-8">
          <button
            onClick={openLoginModal}
            className="w-full py-3 px-4 bg-[#0071f9] text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center"
          >
            Đăng nhập
          </button>
          <button
            onClick={openRegisterModal}
            className="w-full py-3 px-4 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium hover:border-gray-400 flex items-center justify-center hover:-translate-y-0.5"
          >
            Đăng ký
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm ${
            isModalTransitioning ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModals();
          }}
        >
          <div
            className={`bg-white rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl ${
              isModalTransitioning ? "scale-95" : "scale-100"
            } transition-all duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-center flex-1 text-[#152946]">
                Đăng nhập
              </h2>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div
                    className={`relative flex items-center ${
                      emailFocus ? "ring-2 ring-[#0071f9]" : ""
                    } rounded-lg overflow-hidden ${
                      loginErrors.email ? "border-red-500" : ""
                    }`}
                  >
                    <div className="absolute left-3 text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      placeholder="abc123@gmail.com"
                      className={`w-full p-3 pl-10 border ${
                        loginErrors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none`}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <ErrorMessage message={loginErrors.email} />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mật khẩu
                    </label>
                    <button
                      type="button"
                      onClick={openForgotPasswordModal}
                      className="text-sm text-[#0071f9] hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div
                    className={`relative flex items-center ${
                      passwordFocus ? "ring-2 ring-[#0071f9]" : ""
                    } rounded-lg overflow-hidden ${
                      loginErrors.password ? "border-red-500" : ""
                    }`}
                  >
                    <div className="absolute left-3 text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="••••••••••••••••"
                      className={`w-full p-3 pl-10 border ${
                        loginErrors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none`}
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => setPasswordFocus(false)}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage message={loginErrors.password} />
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#0071f9] focus:ring-[#0071f9] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoginSubmitting}
                  className={`w-full py-3 bg-[#0071f9] text-white rounded-lg hover:bg-blue-600 transition-all duration-300 mt-4 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center ${
                    isLoginSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoginSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>

                <div className="relative flex items-center justify-center mt-4">
                  <div className="border-t border-gray-300 absolute w-full"></div>
                  <span className="bg-white px-2 text-sm text-gray-500 relative">
                    hoặc
                  </span>
                </div>

                <button
                  type="button"
                  className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all duration-300 hover:border-gray-400 hover:-translate-y-0.5"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                  Đăng nhập với Google
                </button>

                <div className="text-center text-sm mt-4">
                  <span className="text-gray-600">Chưa có tài khoản? </span>
                  <button
                    type="button"
                    onClick={openRegisterModal}
                    className="text-[#0071f9] hover:underline font-medium"
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm ${
            isModalTransitioning ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModals();
          }}
        >
          <div
            className={`bg-white rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl ${
              isModalTransitioning ? "scale-95" : "scale-100"
            } transition-all duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-center flex-1 text-[#152946]">
                Đăng ký
              </h2>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                <div className="space-y-1">
                  <label
                    htmlFor="register-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      id="register-email"
                      placeholder="abc123@gmail.com"
                      className={`w-full p-3 pl-10 border ${
                        registerErrors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071f9]`}
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  <ErrorMessage message={registerErrors.email} />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="register-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="register-password"
                      placeholder="••••••••••••••••"
                      className={`w-full p-3 pl-10 border ${
                        registerErrors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071f9]`}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage message={registerErrors.password} />
                  {registerPassword && !registerErrors.password && (
                    <PasswordStrength password={registerPassword} />
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nhập lại mật khẩu
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      placeholder="••••••••••••••••"
                      className={`w-full p-3 pl-10 border ${
                        registerErrors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071f9]`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  <ErrorMessage message={registerErrors.confirmPassword} />
                </div>

                <button
                  type="submit"
                  disabled={isRegisterSubmitting}
                  className={`w-full py-3 bg-[#0071f9] text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-4 flex items-center justify-center ${
                    isRegisterSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isRegisterSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    "Đăng ký"
                  )}
                </button>

                <div className="relative flex items-center justify-center mt-4">
                  <div className="border-t border-gray-300 absolute w-full"></div>
                  <span className="bg-white px-2 text-sm text-gray-500 relative">
                    hoặc
                  </span>
                </div>

                <button
                  type="button"
                  className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all duration-300 hover:border-gray-400 hover:-translate-y-0.5"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                  Đăng ký với Google
                </button>

                <div className="text-center text-sm mt-4">
                  <span className="text-gray-600">Đã có tài khoản? </span>
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="text-[#0071f9] hover:underline font-medium"
                  >
                    Đăng nhập
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm ${
            isModalTransitioning ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModals();
          }}
        >
          <div
            className={`bg-white rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl ${
              isModalTransitioning ? "scale-95" : "scale-100"
            } transition-all duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <button
                onClick={openLoginModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-center flex-1 text-[#152946]">
                Quên mật khẩu
              </h2>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn
                để đặt lại mật khẩu.
              </p>

              <form className="space-y-4" onSubmit={handleResetPasswordSubmit}>
                <div className="space-y-1">
                  <label
                    htmlFor="reset-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div
                    className={`relative flex items-center ${
                      resetEmailFocus ? "ring-2 ring-[#0071f9]" : ""
                    } rounded-lg overflow-hidden ${
                      resetErrors.email ? "border-red-500" : ""
                    }`}
                  >
                    <div className="absolute left-3 text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      id="reset-email"
                      placeholder="abc123@gmail.com"
                      className={`w-full p-3 pl-10 border ${
                        resetErrors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none`}
                      onFocus={() => setResetEmailFocus(true)}
                      onBlur={() => setResetEmailFocus(false)}
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                  <ErrorMessage message={resetErrors.email} />
                </div>

                <button
                  type="submit"
                  disabled={isResetSubmitting}
                  className={`w-full py-3 bg-[#0071f9] text-white rounded-lg hover:bg-blue-600 transition-all duration-300 mt-4 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center ${
                    isResetSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isResetSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    "Gửi hướng dẫn đặt lại"
                  )}
                </button>

                <div className="text-center text-sm mt-4">
                  <span className="text-gray-600">Nhớ mật khẩu? </span>
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="text-[#0071f9] hover:underline font-medium"
                  >
                    Đăng nhập
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirmation && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm ${
            isModalTransitioning ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModals();
          }}
        >
          <div
            className={`bg-white rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl ${
              isModalTransitioning ? "scale-95" : "scale-100"
            } transition-all duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="w-8"></div> {/* Empty div for spacing */}
              <h2 className="text-xl font-semibold text-center flex-1 text-[#152946]">
                Kiểm tra email của bạn
              </h2>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-500" />
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Hướng dẫn đã được gửi!
              </h3>

              <p className="text-gray-600 mb-6">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{" "}
                <span className="font-medium text-gray-900">{resetEmail}</span>.
                Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg text-left mb-6">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Không nhận được email?</span>{" "}
                  Kiểm tra thư mục spam hoặc thử lại sau vài phút.
                </p>
              </div>

              <button
                type="button"
                onClick={openLoginModal}
                className="w-full py-3 bg-[#0071f9] text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center"
              >
                <span className="mr-2">Quay lại đăng nhập</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
