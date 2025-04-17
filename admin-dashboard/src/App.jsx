import Layout from "./components/layout";
import ProtectedRoute from "./components/protected-route";
import { ToastProvider } from "./components/toast-provider";
import { AuthProvider } from "./hooks/auth-provider";
import Courses from "./page/Courses";
import Home from "./page/Home";
import ProfilePage from "./page/Profile";
import TestManagement from "./page/TestManagerment";
import Users from "./page/User";
import LoginPage from "./page/loginPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Route đăng nhập - có thể truy cập mà không cần xác thực */}
            <Route path="/login" element={<LoginPage />} />

            {/* Route mặc định - chuyển hướng đến trang chủ */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Các route được bảo vệ - yêu cầu đăng nhập */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-management"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TestManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Users />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Courses />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
