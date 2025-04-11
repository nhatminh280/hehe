"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function EditUserModal({
  formData,
  onChange,
  onSubmit,
  onClose,
}) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Edit User</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-4 space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="edit-email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                type="tel"
                id="edit-phone"
                name="phone"
                value={formData.phone || ""}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <div className="relative">
                <button
                  type="button"
                  id="edit-role"
                  className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                >
                  <span>{formData.role || "Select role"}</span>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M7 7l3 3 3-3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {showRoleDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1">
                      <li
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          onChange({
                            target: { name: "role", value: "Học viên" },
                          });
                          setShowRoleDropdown(false);
                        }}
                      >
                        Học viên
                      </li>
                      <li
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          onChange({
                            target: { name: "role", value: "Giảng viên" },
                          });
                          setShowRoleDropdown(false);
                        }}
                      >
                        Giảng viên
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  id="edit-status"
                  className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <span>{formData.status || "Select status"}</span>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M7 7l3 3 3-3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {showStatusDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1">
                      <li
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          onChange({
                            target: { name: "status", value: "Đang hoạt động" },
                          });
                          setShowStatusDropdown(false);
                        }}
                      >
                        Đang hoạt động
                      </li>
                      <li
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          onChange({
                            target: {
                              name: "status",
                              value: "Không hoạt động",
                            },
                          });
                          setShowStatusDropdown(false);
                        }}
                      >
                        Không hoạt động
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Gender Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <div className="relative">
                <button
                  type="button"
                  id="edit-gender"
                  className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
                  onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                >
                  <span>{formData.gender || "Select gender"}</span>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M7 7l3 3 3-3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {showGenderDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1">
                      <li
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          onChange({
                            target: { name: "gender", value: "Nam" },
                          });
                          setShowGenderDropdown(false);
                        }}
                      >
                        Nam
                      </li>
                      <li
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          onChange({ target: { name: "gender", value: "Nữ" } });
                          setShowGenderDropdown(false);
                        }}
                      >
                        Nữ
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
