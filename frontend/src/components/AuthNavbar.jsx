import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user's name, with fallback to "User" if not available
  const userName = user?.name || "User";

  // Handle logout with redirect
  const handleLogout = async () => {
    await logout();
    navigate('/?signedOut=true');
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/cars" className="text-2xl font-bold text-[#EB5A3C] no-underline">
                CarRental
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/cars"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium no-underline ${
                  location.pathname === "/cars"
                    ? "border-b-2 border-[#EB5A3C] text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Browse Cars
              </Link>
              <Link
                to="/bookings"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium no-underline ${
                  location.pathname === "/bookings"
                    ? "border-b-2 border-[#EB5A3C] text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                My Bookings
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {userName}</span>
              <button
                onClick={handleLogout}
                className="bg-[#EB5A3C] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#d44a2e] transition-colors"
              >
                Logout
              </button>
            </div>
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
            <Link
              to="/cars"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium no-underline ${
                location.pathname === "/cars"
                  ? "bg-[#EB5A3C]/10 border-[#EB5A3C] text-[#EB5A3C]"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Browse Cars
            </Link>
            <Link
              to="/bookings"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium no-underline ${
                location.pathname === "/bookings"
                  ? "bg-[#EB5A3C]/10 border-[#EB5A3C] text-[#EB5A3C]"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              My Bookings
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <span className="text-sm text-gray-700">Welcome, {userName}</span>
                </div>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AuthNavbar; 