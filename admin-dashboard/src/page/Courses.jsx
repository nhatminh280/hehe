"use client";

import courseService from "../api/courseAPI";
import CourseForm from "../components/courseForm";
import {
  Search,
  Plus,
  BookOpen,
  Edit,
  EyeOff,
  ChevronDown,
  Grid,
  List,
  Package,
  TrendingDown,
  TrendingUp,
  Filter,
  X,
  Headphones,
  MessageSquare,
  Users,
  Clock,
  Star,
  DollarSign,
  CalendarIcon,
  CheckCircle,
  Trash2,
  Eye,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

export default function CourseDashboard() {
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // New state for API integration
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getAllCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Không thể tải dữ liệu khóa học. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [refreshTrigger]);

  // Lọc khóa học dựa trên tìm kiếm và bộ lọc
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Lọc theo từ khóa tìm kiếm
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.level.toLowerCase().includes(searchQuery.toLowerCase());

      // Lọc theo danh mục
      const matchesCategory =
        categoryFilter === "all" ||
        (categoryFilter === "LR" && course.type === "LR") ||
        (categoryFilter === "SW" && course.type === "SW");

      // Lọc theo cấp độ
      const matchesLevel =
        levelFilter === "all" ||
        (levelFilter === "basic" && course.level === "Cơ bản") ||
        (levelFilter === "intermediate" && course.level === "Trung cấp") ||
        (levelFilter === "advanced" && course.level === "Nâng cao");

      // Lọc theo trạng thái
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && course.enabled === true) ||
        (statusFilter === "hidden" && course.enabled === false);

      return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
    });
  }, [courses, searchQuery, categoryFilter, levelFilter, statusFilter]);

  // Xử lý click bên ngoài dropdown
  const handleClickOutside = (e) => {
    if (!e.target.closest(".category-dropdown")) {
      setShowCategoryDropdown(false);
    }
    if (!e.target.closest(".level-dropdown")) {
      setShowLevelDropdown(false);
    }
    if (!e.target.closest(".status-dropdown")) {
      setShowStatusDropdown(false);
    }
  };

  // Thêm event listener khi component được mount
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Tính toán thống kê
  const stats = useMemo(() => {
    return {
      totalCourses: courses.length,
      totalStudents: courses.reduce(
        (sum, course) => sum + (course.students || 0),
        0
      ),
      averageRating: courses.length
        ? (
            courses.reduce(
              (sum, course) => sum + Number.parseFloat(course.rating || 0),
              0
            ) / courses.length
          ).toFixed(1)
        : "0.0",
    };
  }, [courses]);

  // Handle course actions
  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setShowForm(true);
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedCourse(null);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setSelectedCourse(null);
    // Trigger a refresh to fetch updated data
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleToggleVisibility = async (course) => {
    try {
      await courseService.toggleCourseVisibility(course.id, !course.enabled);
      // Refresh the course list
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Error toggling course visibility:", err);
      // You could add a toast notification here
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      try {
        await courseService.deleteCourse(courseId);
        // Refresh the course list
        setRefreshTrigger((prev) => prev + 1);
      } catch (err) {
        console.error("Error deleting course:", err);
        // You could add a toast notification here
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8  ">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Test Managerment
          </span>
        </h1>

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
            <button
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
              className="ml-2 underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Package className="h-6 w-6 text-blue-500" />}
            title="Tổng khóa học"
            value={stats.totalCourses}
            trend={{ value: "9.05%", isUp: true }}
            color="blue"
            loading={loading}
          />
          <StatCard
            icon={<Users className="h-6 w-6 text-purple-500" />}
            title="Tổng học viên"
            value={stats.totalStudents.toLocaleString()}
            trend={{ value: "12.3%", isUp: true }}
            color="purple"
            loading={loading}
          />
          <StatCard
            icon={<Star className="h-6 w-6 text-amber-500" />}
            title="Đánh giá trung bình"
            value={stats.averageRating}
            trend={null}
            color="amber"
            loading={loading}
          />
        </div>

        {/* Thanh công cụ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-1 gap-4 flex-wrap">
              {/* Dropdown Danh mục */}
              <div className="relative category-dropdown">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 rounded-lg text-secondary-foreground font-medium transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  {categoryFilter === "all"
                    ? "Tất cả khóa học"
                    : categoryFilter === "LR"
                    ? "Listening & Reading"
                    : "Speaking & Writing"}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-fadeIn">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCategoryFilter("all");
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Tất cả khóa học
                      </button>
                      <button
                        onClick={() => {
                          setCategoryFilter("LR");
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Headphones className="h-4 w-4 mr-2 text-blue-500" />
                        Listening & Reading
                      </button>
                      <button
                        onClick={() => {
                          setCategoryFilter("SW");
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <MessageSquare className="h-4 w-4 mr-2 text-purple-500" />
                        Speaking & Writing
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown Cấp độ */}
              <div className="relative level-dropdown">
                <button
                  onClick={() => setShowLevelDropdown(!showLevelDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 rounded-lg text-secondary-foreground font-medium transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  {levelFilter === "all"
                    ? "Tất cả cấp độ"
                    : levelFilter === "basic"
                    ? "Cơ bản"
                    : levelFilter === "intermediate"
                    ? "Trung cấp"
                    : "Nâng cao"}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showLevelDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-fadeIn">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setLevelFilter("all");
                          setShowLevelDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Tất cả cấp độ
                      </button>
                      <button
                        onClick={() => {
                          setLevelFilter("basic");
                          setShowLevelDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cơ bản
                      </button>
                      <button
                        onClick={() => {
                          setLevelFilter("intermediate");
                          setShowLevelDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Trung cấp
                      </button>
                      <button
                        onClick={() => {
                          setLevelFilter("advanced");
                          setShowLevelDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Nâng cao
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown Trạng thái */}
              {/* <div className="relative status-dropdown">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 rounded-lg text-secondary-foreground font-medium transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  {statusFilter === "all"
                    ? "Tất cả trạng thái"
                    : statusFilter === "active"
                    ? "Đang hoạt động"
                    : "Ẩn"}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-fadeIn">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setStatusFilter("all");
                          setShowStatusDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Tất cả trạng thái
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter("active");
                          setShowStatusDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đang hoạt động
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter("hidden");
                          setShowStatusDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Ẩn
                      </button>
                    </div>
                  </div>
                )}
              </div> */}

              {/* Tìm kiếm */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm khóa học TOEIC..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Nút tạo khóa học */}
            <button
              onClick={handleAddCourse}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" /> Tạo khóa học
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setView("grid")}
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                  view === "grid"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid className="h-4 w-4" /> Thẻ
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                  view === "list"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-4 w-4" /> Danh sách
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {!loading && view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEdit={() => handleEditCourse(course)}
                    onToggleVisibility={() => handleToggleVisibility(course)}
                    onDelete={() => handleDeleteCourse(course.id)}
                  />
                ))}

                {/* Thêm khóa học */}
                <div
                  onClick={handleAddCourse}
                  className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center h-[450px] cursor-pointer hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex flex-col items-center justify-center p-6">
                    <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                      <Plus className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-gray-600 font-medium group-hover:text-gray-800">
                      Thêm khóa học
                    </p>
                  </div>
                </div>
              </div>
            ) : !loading ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                        Khóa học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cấp độ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời lượng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đánh giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Học viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`h-10 w-10 flex-shrink-0 rounded-lg ${getColorClass(
                                course.color,
                                "bg"
                              )} flex items-center justify-center text-white font-bold`}
                            >
                              {course.type}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {course.title}
                              </div>
                              <div className="text-xs text-gray-500 max-w-xs truncate">
                                {course.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              course.level === "Cơ bản"
                                ? "bg-[hsl(var(--chart-2))/20] text-[hsl(var(--chart-2))]"
                                : course.level === "Trung cấp"
                                ? "bg-primary/20 text-primary"
                                : "bg-[hsl(var(--chart-4))/20] text-[hsl(var(--chart-4))]"
                            }`}
                          >
                            {course.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-[hsl(var(--chart-1))] mr-1" />
                            <span className="text-sm text-gray-700">
                              {course.rating}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.students
                            ? course.students.toLocaleString()
                            : 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.price.toLocaleString("vi-VI")} VND
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              course.enabled
                                ? "bg-[hsl(var(--chart-2))/20] text-[hsl(var(--chart-2))]"
                                : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {course.enabled ? "Hoạt động" : "Ẩn"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleToggleVisibility(course)}
                              className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
                              title={
                                course.enabled
                                  ? "Ẩn khóa học"
                                  : "Hiển thị khóa học"
                              }
                            >
                              {course.enabled ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                              title="Xóa khóa học"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {/* Không có kết quả */}
            {!loading && filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  Không tìm thấy khóa học
                </h3>
                <p className="text-gray-500">
                  Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <CourseForm
          course={selectedCourse}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
}

// Component thẻ thống kê
function StatCard({ icon, title, value, trend, color, loading }) {
  const getColorClasses = (color) => {
    const classes = {
      blue: {
        bg: "bg-primary/10",
        iconBg: "bg-primary/20",
        text: "text-primary",
        trendUp: "text-green-600 bg-green-100",
        trendDown: "text-destructive bg-destructive/10",
      },
      purple: {
        bg: "bg-[hsl(var(--chart-4))/10]",
        iconBg: "bg-[hsl(var(--chart-4))/20]",
        text: "text-[hsl(var(--chart-4))]",
        trendUp: "text-green-600 bg-green-100",
        trendDown: "text-destructive bg-destructive/10",
      },
      amber: {
        bg: "bg-[hsl(var(--chart-1))/10]",
        iconBg: "bg-[hsl(var(--chart-1))/20]",
        text: "text-[hsl(var(--chart-1))]",
        trendUp: "text-green-600 bg-green-100",
        trendDown: "text-destructive bg-destructive/10",
      },
    };
    return classes[color] || classes.blue;
  };

  const colorClasses = getColorClasses(color);

  return (
    <div
      className={`rounded-xl shadow-sm border border-gray-200 ${colorClasses.bg} p-6 transition-transform hover:shadow-md hover:-translate-y-1`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          )}
          {trend && !loading && (
            <div
              className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                trend.isUp ? colorClasses.trendUp : colorClasses.trendDown
              }`}
            >
              {trend.isUp ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {trend.value}
            </div>
          )}
        </div>
        <div
          className={`h-12 w-12 rounded-full ${colorClasses.iconBg} flex items-center justify-center ${colorClasses.text}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// Component thẻ khóa học
function CourseCard({ course, onEdit, onToggleVisibility, onDelete }) {
  const getTagColor = (tag) => {
    const colors = {
      "Phổ biến": "bg-primary",
      Bestseller: "bg-[hsl(var(--chart-2))]",
      Premium: "bg-[hsl(var(--chart-4))]",
      Mới: "bg-[hsl(var(--chart-3))]",
      "Đề xuất": "bg-[hsl(var(--chart-1))]",
      VIP: "bg-[hsl(var(--chart-5))]",
    };
    return colors[tag] || "bg-muted-foreground";
  };

  const getColorClass = (color, type) => {
    const classes = {
      blue: {
        bg: "bg-primary",
        light: "bg-primary/10",
        hover: "hover:bg-primary/20",
        text: "text-primary",
        border: "border-primary/20",
      },
      purple: {
        bg: "bg-[hsl(var(--chart-4))]",
        light: "bg-[hsl(var(--chart-4))/10]",
        hover: "hover:bg-[hsl(var(--chart-4))/20]",
        text: "text-[hsl(var(--chart-4))]",
        border: "border-[hsl(var(--chart-4))/20]",
      },
      amber: {
        bg: "bg-[hsl(var(--chart-1))]",
        light: "bg-[hsl(var(--chart-1))/10]",
        hover: "hover:bg-[hsl(var(--chart-1))/20]",
        text: "text-[hsl(var(--chart-1))]",
        border: "border-[hsl(var(--chart-1))/20]",
      },
    };
    return classes[color]?.[type] || classes.blue[type];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div
        className={`relative h-32 ${getColorClass(
          course.color,
          "bg"
        )} flex items-center justify-center`}
      >
        {/* Tag */}
        {course.tag && (
          <div
            className={`absolute top-3 left-3 ${getTagColor(
              course.tag
            )} px-2 py-1 rounded-lg text-xs font-medium text-white`}
          >
            {course.tag}
          </div>
        )}

        {/* Level */}
        <div
          className={`absolute top-3 right-3 bg-background/90 px-2 py-1 rounded-lg text-xs font-medium ${
            course.level === "Cơ bản"
              ? "text-[hsl(var(--chart-2))]"
              : course.level === "Trung cấp"
              ? "text-primary"
              : "text-[hsl(var(--chart-4))]"
          }`}
        >
          {course.level}
        </div>

        {/* Status */}
        {!course.enabled && (
          <div className="absolute bottom-3 right-3 bg-destructive px-2 py-1 rounded-lg text-xs font-medium text-destructive-foreground">
            Ẩn
          </div>
        )}

        <div className="text-white text-3xl font-bold flex flex-col items-center">
          {course.type === "LR" ? (
            <Headphones className="h-10 w-10 mb-2" />
          ) : (
            <MessageSquare className="h-10 w-10 mb-2" />
          )}
          {course.type}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{course.startDate || "Chưa có lịch"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-[hsl(var(--chart-1))] mr-1" />
              <span className="font-medium">{course.rating || "0.0"}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              <span>
                {course.students ? course.students.toLocaleString() : 0} học
                viên
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">
              {course.price.toLocaleString("vi-VI")} VND
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Tính năng nổi bật:
          </p>
          <ul className="space-y-1">
            {course.features &&
              course.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            {(!course.features || course.features.length === 0) && (
              <li className="text-sm text-gray-500">
                Chưa có tính năng nổi bật
              </li>
            )}
          </ul>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onEdit}
            className={`px-4 py-2 ${getColorClass(
              course.color,
              "light"
            )} ${getColorClass(course.color, "hover")} ${getColorClass(
              course.color,
              "text"
            )} rounded-lg font-medium text-sm transition-colors flex items-center`}
          >
            <Edit className="h-4 w-4 mr-1.5" /> Sửa
          </button>
          <div className="flex gap-2">
            <button
              onClick={onToggleVisibility}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-medium text-sm transition-colors flex items-center"
            >
              {course.enabled ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1.5" /> Ẩn
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1.5" /> Hiện
                </>
              )}
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
              title="Xóa khóa học"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get color classes
function getColorClass(color, type) {
  const classes = {
    blue: {
      bg: "bg-primary",
      light: "bg-primary/10",
      hover: "hover:bg-primary/20",
      text: "text-primary",
      border: "border-primary/20",
    },
    purple: {
      bg: "bg-[hsl(var(--chart-4))]",
      light: "bg-[hsl(var(--chart-4))/10]",
      hover: "hover:bg-[hsl(var(--chart-4))/20]",
      text: "text-[hsl(var(--chart-4))]",
      border: "border-[hsl(var(--chart-4))/20]",
    },
    amber: {
      bg: "bg-[hsl(var(--chart-1))]",
      light: "bg-[hsl(var(--chart-1))/10]",
      hover: "hover:bg-[hsl(var(--chart-1))/20]",
      text: "text-[hsl(var(--chart-1))]",
      border: "border-[hsl(var(--chart-1))/20]",
    },
  };
  return classes[color]?.[type] || classes.blue[type];
}
