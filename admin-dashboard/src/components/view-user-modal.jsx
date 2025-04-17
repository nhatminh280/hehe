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
        <div
          className="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 
            overflow-hidden border border-border animate-scaleIn"
        >
          <div
            className="flex items-center justify-between p-4 border-b border-border 
            bg-gradient-to-r from-primary to-blue-700 text-white"
          >
            <h2 className="text-xl font-bold ">User Details</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors
               bg-white/10 rounded-full p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-xl font-bold text-card-foreground">
                  {user.name}
                </h4>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">ID</p>
                <p className="font-medium text-card-foreground">{user.id}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Role</p>
                <p className="font-medium text-card-foreground">{user.role}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Registration Date
                </p>
                <p className="font-medium text-card-foreground">
                  {user.registrationDate}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="font-medium text-card-foreground">
                  {user.status}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="font-medium text-card-foreground">
                  {user.phone || "N/A"}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Gender</p>
                <p className="font-medium text-card-foreground">
                  {user.gender || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-4 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-gradient-to-r from-primary to-blue-700 text-white rounded-lg hover:from-primary/90 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
