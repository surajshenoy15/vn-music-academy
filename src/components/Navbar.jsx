import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // 'admin' or 'student'
  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = useCallback(() => {
    const adminToken = localStorage.getItem("adminToken");
    const studentToken = localStorage.getItem("studentToken");

    if (adminToken) {
      setIsLoggedIn(true);
      setUserType("admin");
    } else if (studentToken) {
      setIsLoggedIn(true);
      setUserType("student");
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (["adminToken", "studentToken"].includes(e.key) || e.key === null) {
        checkLoginStatus();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkLoginStatus]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("studentToken");
    setIsLoggedIn(false);
    setUserType(null);
    navigate("/");
  }, [navigate]);

  return (
    <nav className="bg-white text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-60 h-60 overflow-hidden">
              <img
                src="/logo-name.png"
                alt="VN Music Academy Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 ml-10">
            <Link
              to="/"
              className="hover:bg-[#4A4947] hover:text-white px-3 py-2 rounded-md text-lg font-medium transition"
            >
              Home
            </Link>

            <Link
              to="/courses"
              className="px-3 py-2 rounded-md text-lg font-medium transition-all duration-300 ease-in-out hover:bg-[#4A4947] hover:text-white hover:scale-105"
            >
              Courses
            </Link>

            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-lg font-medium transition-all duration-300 ease-in-out hover:bg-[#4A4947] hover:text-white hover:scale-105">
                Resources
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white text-black rounded-xl shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:visible invisible transition-all duration-300 ease-out origin-top-left ring-1 ring-black/10">
                <Link
                  to="/gallery"
                  className="block px-5 py-3 text-sm hover:bg-gray-100 hover:text-[#4A4947] rounded-t-xl"
                >
                  Gallery
                </Link>
                <Link
                  to="/testimonials"
                  className="block px-5 py-3 text-sm hover:bg-gray-100 hover:text-[#4A4947]"
                >
                  Testimonials
                </Link>
              </div>
            </div>

            <Link
              to="/contact"
              className="hover:bg-[#4A4947] hover:text-white px-3 py-2 rounded-md text-lg font-medium transition"
            >
              Contact Us
            </Link>

            {/* Login / Dashboard / Logout */}
            {isLoggedIn ? (
              <>
                {userType === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                  >
                    <i className="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                  </Link>
                )}

                {userType === "student" && (
                  <Link
                    to="/student/student-dashboard"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                  >
                    <i className="fas fa-graduation-cap"></i>
                    <span>My Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-[#4A4947] hover:bg-gray-800 text-white px-4 py-2 rounded-md text-lg font-medium flex items-center space-x-2"
              >
                <i className="fas fa-user"></i>
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black hover:text-[#4A4947]"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white text-black px-4 pb-4 space-y-2">
          <Link
            to="/"
            className="block px-2 py-2 rounded hover:bg-[#4A4947] hover:text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/courses"
            className="block px-2 py-2 rounded hover:bg-[#4A4947] hover:text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Courses
          </Link>

          <details className="group">
            <summary className="cursor-pointer px-2 py-2 rounded hover:bg-[#4A4947] hover:text-white">
              Resources
            </summary>
            <div className="ml-4">
              <Link
                to="/gallery"
                className="block px-2 py-1 text-sm hover:bg-[#4A4947] hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                to="/testimonials"
                className="block px-2 py-1 text-sm hover:bg-[#4A4947] hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
            </div>
          </details>

          <Link
            to="/contact"
            className="block px-2 py-2 rounded hover:bg-[#4A4947] hover:text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>

          {isLoggedIn ? (
            <>
              {userType === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="block px-2 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-tachometer-alt"></i>
                  <span>Dashboard</span>
                </Link>
              )}

              {userType === "student" && (
                <Link
                  to="/student/student-dashboard"
                  className="block px-2 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-graduation-cap"></i>
                  <span>My Dashboard</span>
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-2 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center space-x-2"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-2 py-2 rounded bg-[#4A4947] text-white hover:bg-gray-800 flex items-center space-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-user"></i>
              <span>Login</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
