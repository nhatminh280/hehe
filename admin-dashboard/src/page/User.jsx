"use client";

import AddUserModal from "../components/add-user-modal";
import DeleteUserModal from "../components/delete-user-modal";
import EditUserModal from "../components/edit-user-modal";
// Tách các component con để cải thiện khả năng bảo trì
import StatCard from "../components/stat-card";
import UserRow from "../components/user-row";
import UserSkeleton from "../components/user-skeleton";
import ViewUserModal from "../components/view-user-modal";
import axios from "axios";
import {
  Users,
  GraduationCap,
  UserPlus,
  Search,
  Filter,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";

const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

// Thêm interceptor để bắt lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Lỗi server với status code
      console.error(`API Error: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      // Không nhận được phản hồi
      console.error("Không nhận được phản hồi từ server", error.request);
    } else {
      // Lỗi trong quá trình thiết lập request
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default function UsersPage() {
  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // cuộn vô cực
  const [displayCount] = useState(10); // Số lượng hiển thị ban đầu
  const observerRef = useRef(null);
  const lastUserElementRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    role: "Học viên",
    phone: "",
    gender: "Nam",
  });

  // Xử lý click bên ngoài dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isDropdownOpen &&
        !event.target.closest(".filter-dropdown-container")
      ) {
        document
          .getElementById("status-filter-dropdown")
          .classList.add("hidden");
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Gọi API để lấy danh sách người dùng
        const response = await api.get("/api/users");
        // Xử lý dữ liệu trả về
        const fetchedUsers = response.data.map((user) => ({
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
          status: "Đang hoạt động",
          registrationDate: new Date().toLocaleDateString("vi-VN"),
          phone: user.phone,
          gender: user.gender,
          avatar: "/placeholder.svg?height=40&width=40",
        }));

        setUsers(fetchedUsers);

        // Tạo thống kê từ dữ liệu
        const statsData = {
          totalUsers: fetchedUsers.length,
          totalStudents: fetchedUsers.filter((user) => user.role === "Học viên")
            .length,
          newRegistrations: Math.floor(fetchedUsers.length * 0.2), // Giả định 20% là đăng ký mới
          usersTrend: { percentage: 5.2 },
          studentsTrend: { percentage: 2.1 },
          registrationTrend: { percentage: 3.7 },
        };

        setStats(statsData);

        // Hiển thị 10 người dùng đầu tiên
        setDisplayedUsers(fetchedUsers.slice(0, displayCount));
        setHasMore(fetchedUsers.length > displayCount);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Fallback to mock data if API fails
        const mockUsers = Array(20)
          .fill(0)
          .map((_, index) => ({
            id: index + 1,
            name: `Người dùng ${index + 1}`,
            email: `user${index + 1}@example.com`,
            role: "Học viên",
            status: index % 5 === 0 ? "Không hoạt động" : "Đang hoạt động",
            registrationDate: new Date().toLocaleDateString("vi-VN"),
            phone: `098765432${index % 10}`,
            gender: index % 2 === 0 ? "Nam" : "Nữ",
            avatar: "/placeholder.svg?height=40&width=40",
          }));

        setUsers(mockUsers);
        setDisplayedUsers(mockUsers.slice(0, displayCount));
        setHasMore(mockUsers.length > displayCount);

        // Tạo thống kê từ dữ liệu mẫu
        const statsData = {
          totalUsers: mockUsers.length,
          totalStudents: mockUsers.filter((user) => user.role === "Học viên")
            .length,
          newRegistrations: Math.floor(mockUsers.length * 0.2),
          usersTrend: { percentage: 5.2 },
          studentsTrend: { percentage: 2.1 },
          registrationTrend: { percentage: 3.7 },
        };

        setStats(statsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [displayCount]);

  // Load more data when scrolling
  const loadMoreUsers = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      // const nextPage = Math.floor(displayedUsers.length / 10) + 1;
      const response = await api.get("/api/users");
      const newUsers = response.data.data.map((user) => ({
        id: user.id, // Tạo ID nếu API không trả về
        name: user.username,
        email: user.email,
        role: user.role,
        status: "Đang hoạt động",
        registrationDate: new Date().toLocaleDateString("vi-VN"),
        phone: user.phone,
        gender: user.gender,
      }));
      setDisplayedUsers([...displayedUsers, ...newUsers]);
      setHasMore(newUsers.length === 10); // Giả sử mỗi page có 10 items
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [displayedUsers, loadingMore, hasMore]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loadingMore &&
          !isLoading
        ) {
          loadMoreUsers();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current = observer;

    if (lastUserElementRef.current) {
      observer.observe(lastUserElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, isLoading, loadMoreUsers]);

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    let filtered = displayedUsers;

    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      const statusToFilter =
        statusFilter === "active" ? "Đang hoạt động" : "Không hoạt động";
      filtered = filtered.filter((user) => user.status === statusToFilter);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.id && user.id.toString().includes(searchTerm))
      );
    }

    return filtered;
  }, [searchTerm, displayedUsers, statusFilter]);

  // Modal handlers
  const openModal = (modalType, user = null) => {
    setActiveModal(modalType);
    setSelectedUser(user);

    if (modalType === "edit" && user) {
      setEditFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        gender: user.gender,
      });
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
  };

  // Form handlers
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  };

  // CRUD operations
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // validate email

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      alert("Email không hợp lệ");
      return;
    }

    // Validate số điện thoại
    if (editFormData.phone && !/^\d{10}$/.test(editFormData.phone)) {
      alert("Số điện thoại không hợp lệ");
      return;
    }

    try {
      // Chuấn bị dữ liệu để gửi API
      const genderForBackend = editFormData.gender === "Nam" ? "M" : "F";
      const payload = {
        username: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
        phone: editFormData.phone,
        gender: genderForBackend,
        status: editFormData.status,
      };

      // Trong thực tế, bạn sẽ gọi API để cập nhật người dùng
      try {
        await api.put(`/api/users/${selectedUser.id}`, payload);
        // Nếu API hoạt động, có thể hiển thị thông báo thành công
        console.log("Cập nhật người dùng thành công");
      } catch (apiError) {
        console.error("API error:", apiError);
        // Vẫn tiếp tục cập nhật UI ngay cả khi API lỗi
      }

      // Cập nhật state
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              id: editFormData.id,
              name: editFormData.name,
              email: editFormData.email,
              role: editFormData.role,
              status: editFormData.status,
              phone: editFormData.phone,
              gender: editFormData.gender,
            }
          : user
      );

      setUsers(updatedUsers);

      // Cập nhật displayedUsers
      const updatedDisplayedUsers = displayedUsers.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              id: editFormData.id,
              name: editFormData.name,
              email: editFormData.email,
              role: editFormData.role,
              status: editFormData.status,
              phone: editFormData.phone,
              gender: editFormData.gender,
            }
          : user
      );

      setDisplayedUsers(updatedDisplayedUsers);
      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Có lỗi xảy ra khi cập nhật người dùng");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !newUserData.username.trim() ||
      !newUserData.email.trim() ||
      !newUserData.password.trim()
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserData.email)) {
      alert("Email không hợp lệ");
      return;
    }

    // Validate số điện thoại
    if (newUserData.phone && !/^\d{10}$/.test(newUserData.phone)) {
      alert("Số điện thoại không hợp lệ");
      return;
    }

    try {
      // Chuyển đổi gender: Nam -> m, Nữ -> f (chữ thường theo yêu cầu của backend)
      const genderForBackend = newUserData.gender === "Nam" ? "m" : "f";

      // Chuẩn bị dữ liệu để gửi API theo đúng schema yêu cầu
      const payload = {
        username: newUserData.username,
        email: newUserData.email,
        password: newUserData.password, // Thêm trường password
        gender: genderForBackend,
        phone: newUserData.phone || "", // Nếu phone không có giá trị thì gửi chuỗi rỗng
      };

      try {
        const response = await api.post("/api/users/create-user", payload);
        console.log("Thêm người dùng thành công:", response.data);

        // Lấy ID từ response nếu có
        let newUserId;
        if (response.data && response.data.id) {
          newUserId = response.data.id;
        } else {
          // Nếu backend không trả về ID, tạo ID giả ở frontend
          newUserId = Date.now().toString(); // Sử dụng timestamp làm ID tạm thời
        }

        // Tạo người dùng mới cho frontend
        const newUser = {
          id: newUserId,
          name: newUserData.username,
          email: newUserData.email,
          role: newUserData.role || "Học viên",
          status: "Đang hoạt động",
          registrationDate: new Date().toLocaleDateString("vi-VN"),
          phone: newUserData.phone || "",
          gender: newUserData.gender, // Giữ nguyên giá trị hiển thị "Nam" hoặc "Nữ"
          avatar: "/placeholder.svg?height=40&width=40",
        };

        // Cập nhật state
        setUsers((prevUsers) => [newUser, ...prevUsers]);

        // Cập nhật displayedUsers
        setDisplayedUsers((prevDisplayed) => [
          newUser,
          ...prevDisplayed.slice(0, prevDisplayed.length - 1),
        ]);

        // Cập nhật thống kê
        setStats((prev) => ({
          ...prev,
          totalUsers: prev.totalUsers + 1,
          totalStudents:
            newUserData.role === "Học viên"
              ? prev.totalStudents + 1
              : prev.totalStudents,
          newRegistrations: prev.newRegistrations + 1,
        }));

        // Đóng modal và reset form
        closeModal();
        setNewUserData({
          username: "",
          email: "",
          password: "", // Thêm trường password vào state reset
          role: "Học viên",
          phone: "",
          gender: "Nam",
        });
      } catch (apiError) {
        console.error("API error:", apiError);
        alert("Có lỗi xảy ra khi thêm người dùng mới");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Có lỗi xảy ra khi thêm người dùng mới");
    }
  };
  const confirmDeleteUser = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API để xóa người dùng
      try {
        await api.delete(`/api/users/${selectedUser.id}`);
        console.log("Xóa người dùng thành công");
      } catch (apiError) {
        console.error("API error:", apiError);
        // Vẫn tiếp tục cập nhật UI ngay cả khi API lỗi
      }

      // Cập nhật state
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
      setUsers(updatedUsers);

      // Cập nhật displayedUsers
      const updatedDisplayedUsers = displayedUsers.filter(
        (user) => user.id !== selectedUser.id
      );
      setDisplayedUsers(updatedDisplayedUsers);

      // Cập nhật thống kê
      setStats((prev) => ({
        ...prev,
        totalUsers: prev.totalUsers - 1,
        totalStudents:
          selectedUser.role === "Học viên"
            ? prev.totalStudents - 1
            : prev.totalStudents,
      }));

      closeModal();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Có lỗi xảy ra khi xóa người dùng");
    }
  };

  return (
    <div className="p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 md:mb-0">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              User Management
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <button
              onClick={() => openModal("add")}
              className="bg-gradient-to-r from-primary to-blue-500 text-foreground px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm người dùng
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={
              <Users className="w-8 h-8  bg-blue-100 dark:bg-primary rounded-full text-primary dark:text-blue-800 flex items-center" />
            }
            title="Total Users"
            value={stats.totalUsers?.toLocaleString() || 0}
            trend={{
              value: stats.usersTrend?.percentage || 0,
              isPositive: true,
              icon: <ArrowUpRight className="h-3 w-3 mr-1" />,
            }}
            bgColor="bg-popover dark:bg-popover"
          />

          <StatCard
            icon={
              <GraduationCap className="h-8 w-8 bg-emerald-100  dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-500 " />
            }
            title="Students"
            value={stats.totalStudents || 0}
            trend={{
              value: stats.studentsTrend?.percentage || 0,
              isPositive: false,
              icon: <ArrowDownRight className="h-3 w-3 mr-1" />,
            }}
            bgColor="bg-popover dark:bg-popover"
          />

          <StatCard
            icon={
              <UserPlus className="h-6 w-6 text-yellow-400 dark:text-yellow-600 bg-yellow-100 dark:bg-yellow-100 rounded-full" />
            }
            title="New Registration"
            value={stats.newRegistrations || 0}
            trend={{
              value: stats.registrationTrend?.percentage || 0,
              isPositive: false,
              icon: <ArrowDownRight className="h-3 w-3 mr-1" />,
            }}
            bgColor="bg-popover dark:bg-popover"
          />
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-card-foreground">
                Danh sách người dùng
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative filter-dropdown-container">
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border border-input rounded-md hover:bg-muted"
                    onClick={() => {
                      document
                        .getElementById("status-filter-dropdown")
                        .classList.toggle("hidden");
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    {statusFilter === "all"
                      ? "Tất cả trạng thái"
                      : statusFilter === "active"
                      ? "Đang hoạt động"
                      : "Không hoạt động"}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </button>
                  <div
                    id="status-filter-dropdown"
                    className="absolute right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-50 hidden"
                  >
                    <div className="py-1">
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "all"
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                        onClick={() => {
                          setStatusFilter("all");
                          document
                            .getElementById("status-filter-dropdown")
                            .classList.add("hidden");
                          setIsDropdownOpen(false);
                        }}
                      >
                        Tất cả trạng thái
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "active"
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                        onClick={() => {
                          setStatusFilter("active");
                          document
                            .getElementById("status-filter-dropdown")
                            .classList.add("hidden");
                          setIsDropdownOpen(false);
                        }}
                      >
                        Đang hoạt động
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "inactive"
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                        onClick={() => {
                          setStatusFilter("inactive");
                          document
                            .getElementById("status-filter-dropdown")
                            .classList.add("hidden");
                          setIsDropdownOpen(false);
                        }}
                      >
                        Không hoạt động
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider rounded-tl-lg">
                      ID
                    </th>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Ảnh
                    </th>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Họ tên
                    </th>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Đăng ký
                    </th>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider rounded-tr-lg">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading
                    ? Array(5)
                        .fill(0)
                        .map((_, index) => <UserSkeleton key={index} />)
                    : filteredUsers.map((user, index) => {
                        // Check if this is the last item
                        const isLastItem = index === filteredUsers.length - 1;

                        return (
                          <UserRow
                            key={user.id}
                            user={user}
                            ref={isLastItem ? lastUserElementRef : null}
                            onView={() => openModal("view", user)}
                            onEdit={() => openModal("edit", user)}
                            onDelete={() => openModal("delete", user)}
                          />
                        );
                      })}
                </tbody>
              </table>
            </div>

            {/* Loading indicator for infinite scroll */}
            {loadingMore && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                <span className="ml-2 text-muted-foreground">
                  Đang tải thêm...
                </span>
              </div>
            )}

            {/* End of list message */}
            {!hasMore && filteredUsers.length > 0 && (
              <div className="text-center py-4 text-muted-foreground">
                Đã hiển thị tất cả người dùng
              </div>
            )}

            {/* No results message */}
            {filteredUsers.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Không tìm thấy người dùng nào
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === "view" && selectedUser && (
        <ViewUserModal user={selectedUser} onClose={closeModal} />
      )}

      {activeModal === "edit" && selectedUser && (
        <EditUserModal
          user={selectedUser}
          formData={editFormData}
          onChange={handleEditInputChange}
          onSubmit={handleEditSubmit}
          onClose={closeModal}
        />
      )}

      {activeModal === "delete" && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onConfirm={confirmDeleteUser}
          onClose={closeModal}
        />
      )}

      {activeModal === "add" && (
        <AddUserModal
          formData={newUserData}
          onChange={handleNewUserInputChange}
          onSubmit={handleAddSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
