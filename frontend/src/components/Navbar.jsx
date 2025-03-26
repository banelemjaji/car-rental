import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // Don't show navbar on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-[#EB5A3C]">
                CarRental
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {!isAuthenticated ? (
                // Navigation items for non-authenticated users
                <>
                  <Link
                    to="/"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === "/"
                        ? "border-[#EB5A3C] text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/cars"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === "/cars"
                        ? "border-[#EB5A3C] text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Cars
                  </Link>
                  <Link
                    to="/about"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === "/about"
                        ? "border-[#EB5A3C] text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    About Us
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/cars"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === "/cars"
                        ? "border-[#EB5A3C] text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Browse Cars
                  </Link>
                  <Link
                    to="/bookings"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === "/bookings"
                        ? "border-[#EB5A3C] text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    My Bookings
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, User</span>
                <button
                  onClick={logout}
                  className="bg-[#EB5A3C] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#d44a2e] transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#EB5A3C] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#d44a2e] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#EB5A3C]"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {!isAuthenticated ? (
              // Mobile menu items for non-authenticated users
              <>
                <Link
                  to="/"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === "/"
                      ? "bg-[#EB5A3C]/10 border-[#EB5A3C] text-[#EB5A3C]"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/cars"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === "/cars"
                      ? "bg-[#EB5A3C]/10 border-[#EB5A3C] text-[#EB5A3C]"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Cars
                </Link>
                <Link
                  to="/about"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === "/about"
                      ? "bg-[#EB5A3C]/10 border-[#EB5A3C] text-[#EB5A3C]"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  About Us
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/cars"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === "/cars"
                      ? "bg-[#EB5A3C]/10 border-[#EB5A3C] text-[#EB5A3C]"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Browse Cars
                </Link>
                <Link
                  to="/bookings"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === "/bookings"
                      ? "bg-[#EB5A3C]/10 border-[#EB5A3C] text-[#EB5A3C]"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  My Bookings
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <span className="text-sm text-gray-700">Welcome, User</span>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4 space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-[#EB5A3C] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#d44a2e] transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
      </div>
      )}
    </nav>
  );
};

export default Navbar;
