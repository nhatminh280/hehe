"use client";

import testsData from "../json/tests.json";
import {
  X,
  Upload,
  Clock,
  FileText,
  Check,
  Edit,
  Eye,
  Plus,
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTest, setNewTest] = useState({
    name: "",
    status: "Active",
    duration: "60 min",
    course: "",
    questions: 0,
    file: null,
    fileName: "",
  });
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Calculate stats from tests data
  const activeTestsCount = tests.filter(
    (test) => test.status === "Active"
  ).length;
  const totalQuestionsCount = tests.reduce(
    (total, test) => total + (Number.parseInt(test.questions) || 0),
    0
  );

  // Filter tests based on search term
  const filteredTests = tests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Load tests from the JSON file when component mounts
    setTests(testsData);
  }, []);

  useEffect(() => {
    // Add click outside listener for modals
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeAllModals();
      }
    }

    if (isModalOpen || isViewModalOpen || isEditModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, isViewModalOpen, isEditModalOpen]);

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleAddTest = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form
    setNewTest({
      name: "",
      status: "Active",
      duration: "60 min",
      course: "",
      questions: 0,
      file: null,
      fileName: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTest({
      ...newTest,
      [name]: value,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTest({
      ...selectedTest,
      [name]: value,
    });
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        setNewTest({
          ...newTest,
          file: file,
          fileName: file.name,
        });

        // Optionally read the file to extract test details
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = JSON.parse(event.target.result);
            // If the JSON has these fields, use them to populate the form
            setNewTest((prev) => ({
              ...prev,
              name: jsonData.name || prev.name,
              course: jsonData.course || prev.course,
              questions: jsonData.questions || prev.questions,
              // Keep the default duration if not specified
              duration: jsonData.duration || prev.duration,
            }));
          } catch (error) {
            console.error("Error parsing JSON file:", error);
          }
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a JSON file");
        e.target.value = null;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!newTest.name.trim()) {
      alert("Please enter a test name");
      return;
    }

    if (!newTest.file) {
      alert("Please upload a JSON file");
      return;
    }

    // Create new test object
    const testToAdd = {
      id: tests.length + 1,
      name: newTest.name,
      course: newTest.course || "Not specified",
      questions: newTest.questions || 0,
      duration: newTest.duration,
      status: newTest.status,
    };

    // Add to tests array
    setTests([...tests, testToAdd]);

    // Close modal and reset form
    closeModal();

    // Show success message
    alert("Test added successfully!");
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!selectedTest.name.trim()) {
      alert("Please enter a test name");
      return;
    }

    // Update the test in the array
    const updatedTests = tests.map((test) =>
      test.id === selectedTest.id ? selectedTest : test
    );

    setTests(updatedTests);
    closeEditModal();

    // Show success message
    alert("Test updated successfully!");
  };

  const handleViewTest = (test) => {
    setSelectedTest(test);
    setIsViewModalOpen(true);
  };

  const handleEditTest = (test) => {
    setSelectedTest({ ...test });
    setIsEditModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTest(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTest(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-600 text-white";
      case "Draft":
        return "bg-yellow-600 text-white";
      case "Inactive":
        return "bg-rose-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 md:mb-0">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
              Test Management
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <button
              onClick={handleAddTest}
              className="bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add new test
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col space-y-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary dark:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>

              <div>
                <p className="text-muted-foreground font-medium">Total Users</p>
                <div className="flex items-center mt-1">
                  <h3 className="text-3xl font-bold mr-2 text-foreground">
                    3,782
                  </h3>
                  <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                    <span className="font-medium">11.01%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Test Card */}
          <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col space-y-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary dark:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>

              <div>
                <p className="text-muted-foreground font-medium">
                  Active tests
                </p>
                <div className="flex items-center mt-1">
                  <h3 className="text-3xl font-bold mr-2 text-foreground">
                    {activeTestsCount}
                  </h3>
                  <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                    <span className="font-medium">
                      {tests.length > 0
                        ? ((activeTestsCount / tests.length) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Questions Card */}
          <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col space-y-4">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary dark:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="20" x2="12" y2="10"></line>
                  <line x1="18" y1="20" x2="18" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="16"></line>
                </svg>
              </div>

              <div>
                <p className="text-muted-foreground font-medium">
                  Total questions
                </p>
                <div className="flex items-center mt-1">
                  <h3 className="text-3xl font-bold text-foreground">
                    {totalQuestionsCount}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test List */}
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Test list</h2>
            </div>

            {/* Test Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider rounded-tl-lg">
                      Test Name
                    </th>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Courses
                    </th>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Questions
                    </th>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 bg-muted text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
                      <tr
                        key={test.id}
                        className="bg-card hover:bg-muted/30 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-foreground">
                                {test.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {test.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {test.course}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">
                            {test.questions}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            questions
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-foreground">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            {test.duration}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              test.status
                            )}`}
                          >
                            {test.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewTest(test)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors shadow-sm"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleEditTest(test)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30 transition-colors shadow-sm"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <AlertCircle className="h-10 w-10 mb-2" />
                          <p className="text-lg font-medium">No tests found</p>
                          <p className="text-sm">
                            Try adjusting your search or add a new test
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Test Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-border animate-scaleIn"
          >
            <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-primary to-blue-700 text-white">
              <h3 className="text-xl font-bold">Add New Test</h3>
              <button
                onClick={closeModal}
                className="text-white/80 hover:text-white transition-colors bg-white/10 rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                {/* File Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Upload Test File (JSON)
                  </label>
                  <div
                    onClick={handleFileClick}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
                      ${
                        newTest.file
                          ? "border-primary/50 bg-primary/5 shadow-inner"
                          : "border-border hover:border-primary/30 hover:bg-muted/50"
                      }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".json,application/json"
                      className="hidden"
                    />

                    {newTest.file ? (
                      <div className="flex items-center justify-center space-x-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {newTest.fileName}
                        </span>
                        <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="bg-primary/10 p-3 rounded-full mb-2">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium text-primary">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </div>
                        <p className="text-xs text-muted-foreground">
                          JSON files only
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground"
                  >
                    Test Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newTest.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    placeholder="Enter test name"
                    required
                  />
                </div>

                {/* Course */}
                <div className="space-y-2">
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium text-foreground"
                  >
                    Course
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={newTest.course}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    placeholder="Enter course name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Questions Count */}
                  <div className="space-y-2">
                    <label
                      htmlFor="questions"
                      className="block text-sm font-medium text-foreground"
                    >
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      id="questions"
                      name="questions"
                      value={newTest.questions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                      placeholder="Enter number"
                      min="0"
                    />
                  </div>

                  {/* Completion Time */}
                  <div className="space-y-2">
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-foreground"
                    >
                      Completion Time
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={newTest.duration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        placeholder="60 min"
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-foreground"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newTest.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-primary to-blue-700 text-white rounded-lg hover:from-primary/90 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Add Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Test Modal */}
      {isViewModalOpen && selectedTest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-border animate-scaleIn"
          >
            <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-primary to-blue-700 text-white">
              <h3 className="text-xl font-bold">Test Details</h3>
              <button
                onClick={closeViewModal}
                className="text-white/80 hover:text-white transition-colors bg-white/10 rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-bold text-foreground">
                    {selectedTest.name}
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedTest.status
                    )}`}
                  >
                    {selectedTest.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Course</p>
                    <p className="font-medium text-foreground">
                      {selectedTest.course}
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Questions
                    </p>
                    <p className="font-medium text-foreground">
                      {selectedTest.questions}
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Duration
                    </p>
                    <p className="font-medium text-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      {selectedTest.duration}
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Test ID
                    </p>
                    <p className="font-medium text-foreground">
                      {selectedTest.id}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <h5 className="font-medium mb-3">Test Description</h5>
                  <p className="text-muted-foreground text-sm bg-muted/30 p-4 rounded-lg">
                    {selectedTest.description ||
                      "No description available for this test."}
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeViewModal}
                    className="px-4 py-2.5 bg-gradient-to-r from-primary to-blue-700 text-white rounded-lg hover:from-primary/90 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Test Modal */}
      {isEditModalOpen && selectedTest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-border animate-scaleIn"
          >
            <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-primary to-blue-700 text-white">
              <h3 className="text-xl font-bold">Edit Test</h3>
              <button
                onClick={closeEditModal}
                className="text-white/80 hover:text-white transition-colors bg-white/10 rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="space-y-5">
                {/* Test Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="edit-name"
                    className="block text-sm font-medium text-foreground"
                  >
                    Test Name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={selectedTest.name}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    placeholder="Enter test name"
                    required
                  />
                </div>

                {/* Course */}
                <div className="space-y-2">
                  <label
                    htmlFor="edit-course"
                    className="block text-sm font-medium text-foreground"
                  >
                    Course
                  </label>
                  <input
                    type="text"
                    id="edit-course"
                    name="course"
                    value={selectedTest.course}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    placeholder="Enter course name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Questions Count */}
                  <div className="space-y-2">
                    <label
                      htmlFor="edit-questions"
                      className="block text-sm font-medium text-foreground"
                    >
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      id="edit-questions"
                      name="questions"
                      value={selectedTest.questions}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                      placeholder="Enter number"
                      min="0"
                    />
                  </div>

                  {/* Completion Time */}
                  <div className="space-y-2">
                    <label
                      htmlFor="edit-duration"
                      className="block text-sm font-medium text-foreground"
                    >
                      Completion Time
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="edit-duration"
                        name="duration"
                        value={selectedTest.duration}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2.5 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        placeholder="60 min"
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label
                    htmlFor="edit-status"
                    className="block text-sm font-medium text-foreground"
                  >
                    Status
                  </label>
                  <select
                    id="edit-status"
                    name="status"
                    value={selectedTest.status}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-primary to-blue-700 text-white rounded-lg hover:from-primary/90 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
