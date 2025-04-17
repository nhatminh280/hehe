"use client";

import { CheckCircle2, XCircle, Eye, Edit, Trash2 } from "lucide-react";
import { UserCircle } from "lucide-react";
import { forwardRef } from "react";

const UserRow = forwardRef(({ user, onView, onEdit, onDelete }, ref) => {
  const getStatusColor = (status) => {
    if (status === "Đang hoạt động") {
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    } else {
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  const getRoleColor = () => {
    return "bg-primary/10 text-primary dark:bg-primary/20";
  };

  return (
    <tr
      ref={ref}
      className="bg-card hover:bg-accent/10 transition-colors duration-150"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">
        {user.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
          <UserCircle className="h-full w-full object-cover text-muted-foreground" />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">
        {user.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor()}`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
        {user.registrationDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {user.status === "Đang hoạt động" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-1.5" />
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
            className="h-8 w-8 p-0 flex items-center justify-center rounded-md text-primary hover:text-primary-foreground hover:bg-primary transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={onEdit}
            className="h-8 w-8 p-0 flex items-center justify-center rounded-md text-amber-600 hover:text-amber-50 hover:bg-amber-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="h-8 w-8 p-0 flex items-center justify-center rounded-md text-destructive hover:text-destructive-foreground hover:bg-destructive transition-colors"
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
