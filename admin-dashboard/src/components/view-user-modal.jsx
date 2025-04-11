"use client";

import { X } from "lucide-react";

export default function ViewUserModal({ user, onClose }) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{user.name}</h4>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">ID</p>
                <p className="font-medium text-gray-800">{user.id}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <p className="font-medium text-gray-800">{user.role}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Registration Date</p>
                <p className="font-medium text-gray-800">
                  {user.registrationDate}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="font-medium text-gray-800">{user.status}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
