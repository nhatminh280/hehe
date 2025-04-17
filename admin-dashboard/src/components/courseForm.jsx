"use client";

import courseService from "../api/courseAPI";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function CourseForm({ course = null, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "Cơ bản",
    duration: "6 tuần",
    price: "",
    type: "LR",
    tag: "Phổ biến",
    features: ["", "", ""],
    color: "blue",
    status: "active",
    enabled: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
        features: course.features || ["", "", ""],
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      features: updatedFeatures,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Filter out empty features
      const cleanedData = {
        ...formData,
        features: formData.features.filter((feature) => feature.trim() !== ""),
      };

      if (course) {
        // Update existing course
        await courseService.updateCourse(course.id, cleanedData);
      } else {
        // Create new course
        await courseService.createCourse(cleanedData);
      }

      onSave();
    } catch (err) {
      setError("Có lỗi xảy ra khi lưu khóa học. Vui lòng thử lại.");
      console.error("Error saving course:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            {course ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tiêu đề khóa học
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Loại khóa học
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="LR">Listening & Reading</option>
                  <option value="SW">Speaking & Writing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cấp độ</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Cơ bản">Cơ bản</option>
                  <option value="Trung cấp">Trung cấp</option>
                  <option value="Nâng cao">Nâng cao</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Thời lượng
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Giá</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tag</label>
                <select
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Phổ biến">Phổ biến</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="Premium">Premium</option>
                  <option value="Mới">Mới</option>
                  <option value="Đề xuất">Đề xuất</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Màu sắc
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="blue">Xanh dương</option>
                  <option value="purple">Tím</option>
                  <option value="amber">Cam</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tính năng nổi bật
              </label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <input
                    key={index}
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={`Tính năng ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Trạng thái
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="enabled"
                    checked={formData.enabled === true}
                    onChange={() => setFormData({ ...formData, enabled: true })}
                    className="mr-2"
                  />
                  Hiển thị
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="enabled"
                    checked={formData.enabled === false}
                    onChange={() =>
                      setFormData({ ...formData, enabled: false })
                    }
                    className="mr-2"
                  />
                  Ẩn
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-secondary-foreground"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-primary-foreground"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : course ? "Cập nhật" : "Tạo khóa học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
