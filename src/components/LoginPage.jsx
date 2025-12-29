import React, { useState } from 'react';
import { User, Shield, Mail, Lock, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const LoginPage = () => {
  const [userType, setUserType] = useState('student'); // 'student' or 'admin'
  const [studentEmail, setStudentEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Update this to your actual backend URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vn-music-academy.onrender.com';

  const handleSendOTP = async () => {
    if (!studentEmail || !studentEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Sending OTP to:", studentEmail);
      
      const res = await fetch(`${API_BASE_URL}/api/student/send-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email: studentEmail }),
      });

      console.log("Send OTP Response Status:", res.status);
      
      if (!res.ok) {
        let errorMessage = "Failed to send OTP";
        
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = res.statusText || errorMessage;
        }
        
        if (res.status === 404) {
          errorMessage = "Email not found in student database. Please contact admin.";
        }
        
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("Send OTP Success:", data);

      setOtpSent(true);
      toast.success("OTP sent! Please check your email inbox.");
      
    } catch (err) {
      console.error("Send OTP error:", err);
      
      if (err.name === 'TypeError' || err.message.includes('fetch')) {
        toast.error("Unable to connect to server. Check if backend is running.");
      } else {
       toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStudentLogin = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Verifying OTP for:", studentEmail, "OTP:", otp);
      
      const res = await fetch(`${API_BASE_URL}/api/student/verify-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          email: studentEmail, 
          otp: otp 
        }),
      });

      console.log("Verify OTP Response Status:", res.status);
      
      if (!res.ok) {
        let errorMessage = "OTP verification failed";
        
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = res.statusText || errorMessage;
        }
        
        if (res.status === 400) {
          errorMessage = "Invalid or expired OTP. Please try again.";
        } else if (res.status === 404) {
          errorMessage = "Student not found. Please contact admin.";
        }
        
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("=== STUDENT LOGIN SUCCESS ===");
      console.log("Response data:", data);

      // Store the student token and user data
      const token = data.session?.access_token || data.token || data.access_token || data.jwt;
      const studentData = data.user || data.session?.user || data.student || data.data;
      
      if (token) {
        // Clear any admin token first
        localStorage.removeItem("adminToken");
        localStorage.setItem("studentToken", token);
        console.log("✅ Student token stored successfully");
      } else {
        console.error("❌ No token received from server");
        throw new Error("No authentication token received from server");
      }
      
      if (studentData) {
        localStorage.setItem("studentData", JSON.stringify(studentData));
        console.log("✅ Student data stored");
      }

      // Force navbar to update immediately
      if (window.forceNavbarUpdate) {
        console.log("🔄 Calling forceNavbarUpdate for student");
        window.forceNavbarUpdate();
      }

      // Dispatch custom event for navbar
      window.dispatchEvent(new Event('studentLoginSuccess'));
      console.log("📡 studentLoginSuccess event dispatched");

      // Show success message
      toast.success("Login successful! Redirecting...");

      // Navigate to student dashboard
      setTimeout(() => {
        console.log("🚀 Navigating to student dashboard");
        navigate("/student/student-dashboard");
      }, 100);

    } catch (err) {
      console.error("Student login error:", err);
      
      if (err.name === 'TypeError' || err.message.includes('fetch')) {
        toast.error("Unable to connect to server. Check backend connection.");
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    console.log("🚀 handleAdminLogin CALLED!");
    console.log("Admin email:", adminEmail);
    console.log("Admin password:", adminPassword ? "***PROVIDED***" : "***MISSING***");
    
    if (!adminEmail || !adminPassword) {
       toast.error("Enter both email & password");
      return;
    }

    setLoading(true);
    try {
      console.log("🔐 Admin login attempt for:", adminEmail);
      
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          email: adminEmail, 
          password: adminPassword 
        }),
      });

      console.log("📡 Admin Login Response Status:", res.status);
      
      if (!res.ok) {
        let errorMessage = "Login failed";
        
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = res.statusText || errorMessage;
        }
        
        if (res.status === 401) {
          errorMessage = "Invalid email or password";
        }
        
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("=== ADMIN LOGIN SUCCESS ===");
      console.log("📦 Raw API Response:", JSON.stringify(data, null, 2));

      // FIXED: Extract token from the correct location based on your API response
      console.log("=== TOKEN EXTRACTION DEBUG ===");
      console.log("data.session?.access_token:", data.session?.access_token);
      console.log("data.token:", data.token);
      console.log("data.access_token:", data.access_token);
      console.log("data.jwt:", data.jwt);

      // Your API returns the token in data.session.access_token
      const token = data.session?.access_token || data.token || data.access_token || data.jwt;
      
      console.log("🔑 Final extracted token:", token ? token.substring(0, 20) + "..." : "NONE");
      console.log("🔍 Token type:", typeof token);
      console.log("✅ Token is truthy:", !!token);

      if (token) {
        console.log("✅ Token found, storing admin credentials...");
        
        // Clear any student token first
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentData");
        console.log("🧹 Cleared student credentials");
        
        // Store admin token
        localStorage.setItem("adminToken", token);
        console.log("💾 Admin token stored successfully");
        
        // Verify storage immediately
        const storedToken = localStorage.getItem("adminToken");
        console.log("✨ Verification - token stored correctly:", storedToken === token);
        
        // Store admin data if available
        const adminData = data.user || data.session?.user || data.admin || data.data;
        if (adminData) {
          localStorage.setItem("adminData", JSON.stringify(adminData));
          console.log("💾 Admin data stored");
        }
        
        // List all localStorage contents for debugging
        console.log("📦 All localStorage contents:", {...localStorage});
        
      } else {
        console.error("❌ NO TOKEN FOUND IN API RESPONSE!");
        console.log("Available data keys:", Object.keys(data));
        throw new Error("No authentication token received from server");
      }

      // Force navbar to update immediately with enhanced debugging
      console.log("=== NAVBAR UPDATE DEBUG ===");
      console.log("window.forceNavbarUpdate exists:", typeof window.forceNavbarUpdate === 'function');

      if (window.forceNavbarUpdate) {
        console.log("🔄 Calling forceNavbarUpdate for admin...");
        window.forceNavbarUpdate();
        console.log("✅ forceNavbarUpdate called successfully");
      } else {
        console.error("❌ window.forceNavbarUpdate not available!");
      }

      // Dispatch custom event for navbar
      console.log("📡 Dispatching loginSuccess event...");
      window.dispatchEvent(new Event('loginSuccess'));
      console.log("✅ loginSuccess event dispatched");

      // Show success message
      toast.success("Admin login successful! Redirecting...");

      // Final verification after a delay
      setTimeout(() => {
        console.log("=== FINAL VERIFICATION (after 1 second) ===");
        console.log("Admin token in localStorage:", localStorage.getItem("adminToken") ? "EXISTS" : "MISSING");
        console.log("All localStorage:", {...localStorage});
        
        // Try to trigger navbar update again
        if (window.forceNavbarUpdate) {
          console.log("🔄 Second navbar update attempt...");
          window.forceNavbarUpdate();
        }
      }, 1000);

      // Navigate to admin dashboard
      setTimeout(() => {
        console.log("🚀 Navigating to admin dashboard");
        navigate("/admin/dashboard");
      }, 100);

    } catch (err) {
      console.error("❌ Admin login error:", err);
      
      if (err.name === 'TypeError' || err.message.includes('fetch')) {
        toast.error("Unable to connect to server. Check backend connection.");
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetStudentLogin = () => {
    setOtpSent(false);
    setOtp('');
    setStudentEmail('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#4A4947' }}
          >
            <div className="text-white text-2xl font-bold">VN</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">VN Music Academy</h1>
          <p className="text-gray-600">Welcome back! Please sign in to continue.</p>
        </div>

        {/* User Type Selection */}
        <div className="flex mb-6 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => {
              setUserType('student');
              resetStudentLogin();
            }}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all duration-200 ${
              userType === 'student'
                ? 'text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={{ 
              backgroundColor: userType === 'student' ? '#4A4947' : 'transparent' 
            }}
          >
            <User className="w-4 h-4 mr-2" />
            Student
          </button>
          <button
            onClick={() => setUserType('admin')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all duration-200 ${
              userType === 'admin'
                ? 'text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={{ 
              backgroundColor: userType === 'admin' ? '#4A4947' : 'transparent' 
            }}
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin
          </button>
        </div>

        {/* Student Login Form */}
        {userType === 'student' && (
          <div>
            {!otpSent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleSendOTP)}
                      placeholder="Enter your registered email address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Only registered student emails can receive OTP
                  </p>
                </div>
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
                  style={{ backgroundColor: '#4A4947' }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send OTP
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onKeyPress={(e) => handleKeyPress(e, handleStudentLogin)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 focus:border-transparent outline-none transition-all text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    OTP sent to {studentEmail}
                  </p>
                </div>
                <button
                  onClick={handleStudentLogin}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
                  style={{ backgroundColor: '#4A4947' }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Verify & Login'
                  )}
                </button>
                <button
                  onClick={resetStudentLogin}
                  className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change Email Address
                </button>
              </div>
            )}
          </div>
        )}

        {/* Admin Login Form */}
        {userType === 'admin' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAdminLogin)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2 w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-gray-500" 
                  style={{ accentColor: '#4A4947' }}
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label> */}
              {/* <a 
                href="#" 
                className="text-sm hover:underline" 
                style={{ color: '#4A4947' }}
              >
                Forgot password?
              </a> */}
            </div>

            <button
              onClick={handleAdminLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
              style={{ backgroundColor: '#4A4947' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a 
              href="#" 
              className="hover:underline" 
              style={{ color: '#4A4947' }}
            >
              Contact Support
            </a>
          </p>
        </div>

        {/* Enhanced Connection Status - remove in production */}
        {/* <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <div>Backend URL: {API_BASE_URL}</div>
          <div>Admin Token: {localStorage.getItem("adminToken") ? "YES" : "NO"}</div>
          <div>Student Token: {localStorage.getItem("studentToken") ? "YES" : "NO"}</div>
          <div>Current User Type: {userType}</div>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;