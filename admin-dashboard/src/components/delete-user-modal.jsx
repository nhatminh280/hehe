"use client";

import { X, AlertTriangle } from "lucide-react";

export default function DeleteUserModal({ user, onConfirm, onClose }) {
  return (
    <>
      <div
        className="fixed inset-0 bg-background/50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-bold text-destructive">Delete User</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-destructive/20 dark:bg-destructive/30 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-card-foreground">
                  Confirm Deletion
                </h4>
                <p className="text-muted-foreground">
                  Are you sure you want to delete the user "{user.name}"? This
                  action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md text-muted-foreground font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-destructive hover:bg-destructive/90 rounded-md text-destructive-foreground font-medium transition-colors"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
