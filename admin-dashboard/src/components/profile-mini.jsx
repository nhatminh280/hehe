"use client";

import { Mail, Phone, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const useProfileData = () => {
  const [data, setData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+1 (555) 123-4567",
    profilePicture: "/placeholder.svg?height=200&width=200",
  });

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedData = localStorage.getItem("profileData");
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const updateProfileData = (newData) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    // Save to localStorage to persist between components
    localStorage.setItem("profileData", JSON.stringify(updatedData));
  };

  return { profileData: data, updateProfileData };
};

export default function ProfileMini() {
  const { profileData } = useProfileData();

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("Logging out...");
    // clear session & token hear
  };

  return (
    <div className="border rounded-xl shadow-lg w-80 overflow-hidden">
      {/* Profile Header with primary color background */}
      <div className="bg-primary p-6 text-primary-foreground">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-md mb-3">
              <img
                src={profileData.profilePicture || "/placeholder.svg"}
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h3 className="font-bold text-xl">{profileData.name}</h3>
          <span className="text-sm text-primary-foreground/80 mt-1">
            Administrator
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="p-5 space-y-4 bg-card text-card-foreground">
        {/* Email Field */}
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-full">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              Email
            </div>
            <div className="text-sm font-medium">{profileData.email}</div>
          </div>
        </div>

        {/* Phone Field */}
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-full">
            <Phone className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              Phone
            </div>
            <div className="text-sm font-medium">{profileData.phone}</div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-border p-4 flex justify-between bg-card">
        <Link
          to="/login"
          onClick={handleLogout}
          className="flex items-center gap-2 text-destructive hover:bg-destructive/10 transition-colors px-3 py-2 rounded-lg"
        >
          <LogOut className="h-4 w-4" />
          <span onClick={handleLogout} className="text-sm font-medium">
            Logout
          </span>
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-2 text-primary hover:bg-primary/10 transition-colors px-3 py-2 rounded-lg"
        >
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">View Profile</span>
        </Link>
      </div>
    </div>
  );
}
