import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// Course API services
export const courseService = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await api.get("/api/courses");
      console.log(response.data);

      return response.data.body || [];
    } catch (error) {
      console.error("Error fetching courses:", error);
      console.log(error.response.data);
      throw error;
    }
  },

  // Get course by ID
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/api/courses/${id}`);
      return response.data.body;
    } catch (error) {
      console.error(`Error fetching course with id ${id}:`, error);
      throw error;
    }
  },

  // Create new course
  createCourse: async (courseData) => {
    try {
      const response = await api.post("/api/courses", courseData);
      return response.data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },

  // Update course
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/api/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error(`Error updating course with id ${id}:`, error);
      throw error;
    }
  },

  // Delete course
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/api/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting course with id ${id}:`, error);
      throw error;
    }
  },

  // Toggle course visibility
  toggleCourseVisibility: async (id, isEnabled) => {
    try {
      const response = await api.patch(`/api/courses/${id}/visibility`, {
        enabled: isEnabled,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error toggling visibility for course with id ${id}:`,
        error
      );
      throw error;
    }
  },
};

export default courseService;
