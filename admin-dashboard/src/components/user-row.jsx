"use client";

import { CheckCircle2, XCircle, Eye, Edit, Trash2 } from "lucide-react";
import { UserCircle } from "lucide-react";
import { forwardRef } from "react";

const UserRow = forwardRef(({ user, onView, onEdit, onDelete }, ref) => {
  const getStatusColor = (status) => {
    if (status === "Đang hoạt động") {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    } else {
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  const getRoleColor = () => {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  };

  return (
    <tr
      ref={ref}
      className="bg-white hover:bg-gray-50 transition-colors duration-150"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {user.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
          <UserCircle className="h-full w-full object-cover text-slate-500" />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {user.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor()}`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.registrationDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {user.status === "Đang hoạt động" ? (
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500 mr-1.5" />
          )}
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              user.status
            )}`}
          >
            {user.status}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex space-x-2">
          <button
            onClick={onView}
            className="h-8 w-8 p-0 flex items-center justify-center rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={onEdit}
            className="h-8 w-8 p-0 flex items-center justify-center rounded-md text-amber-600 hover:text-amber-800 hover:bg-amber-100"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="h-8 w-8 p-0 flex items-center justify-center rounded-md text-red-600 hover:text-red-800 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
});

UserRow.displayName = "UserRow";

export default UserRow;
