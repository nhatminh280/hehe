"use client";

import Logo from "../logo/LogoApp";
import ProfileMini from "./profile-mini";
import { Bell, ChevronDown, Menu, Moon, Sun, CircleUser } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (savedTheme === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    // Close profile dropdown when clicking outside
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  // Kiểm tra đường dẫn hiện tại để highlight menu item đang active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen flex-col bg-background select-none">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            collapsed ? "w-[65px]" : "w-64"
          } transition-all duration-300 ease-in-out border-r border-border bg-background h-full `}
        >
          <div className="p-[13px] border-border">
            <div className="flex items-center gap-2 text-lg font-medium">
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-full hover:bg-secondary/10 dark:hover:bg-secondary/20 text-foreground"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className={`${collapsed ? "hidden" : "block"}`}>
                <Logo />
              </span>
            </div>
          </div>

          <div className="py-2">
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 hover:bg-primary/10 dark:hover:bg-primary/20shadow-none hover:shadow-md transition-shadow duration-300
 ${
   isActive("/dashboard")
     ? "text-primary-foreground bg-primary"
     : "text-foreground"
 }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span className={`${collapsed ? "hidden" : "block"}`}>
                Dashboard
              </span>
            </Link>
            <Link
              to="/test-management"
              className={`flex items-center px-4 py-3 hover:bg-primary/10 dark:hover:bg-primary/20 shadow-none hover:shadow-md transition-shadow duration-300
              ${
                isActive("/test-management")
                  ? "text-primary-foreground bg-primary"
                  : "text-foreground"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className={`${collapsed ? "hidden" : "block"}`}>
                Test management
              </span>
            </Link>
            <Link
              to="/users"
              className={`flex items-center px-4 py-3 hover:bg-primary/10 dark:hover:bg-primary/20  shadow-none hover:shadow-md transition-shadow duration-300
${
  isActive("/users") ? "text-primary-foreground bg-primary" : "text-foreground"
}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className={`${collapsed ? "hidden" : "block"}`}>Users</span>
            </Link>
            <Link
              to="/courses"
              className={`flex items-center px-4 py-3 hover:bg-primary/10 dark:hover:bg-primary/20 shadow-none hover:shadow-md transition-shadow duration-300
${
  isActive("/courses")
    ? "text-primary-foreground bg-primary"
    : "text-foreground"
}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span className={`${collapsed ? "hidden" : "block"}`}>
                Courses
              </span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="h-16 border-b border-border flex items-center justify-end px-6 bg-background">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-secondary/10 dark:hover:bg-secondary/20 text-foreground"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button className="p-2 rounded-full hover:bg-secondary/10 dark:hover:bg-secondary/20 text-foreground relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </button>
              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center gap-2 hover:bg-secondary/10 dark:hover:bg-secondary/20 px-3 py-1 rounded text-foreground"
                  onClick={toggleProfile}
                >
                  Admin
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Profile Mini Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 z-50">
                    <ProfileMini />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="overflow-auto bg-background text-foreground">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
