// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ⭐ Toast Support

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import Whatsapp from "./components/Whatsapp";  

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Testimonials from "./pages/Testimonials";
import Gallery from "./pages/Gallery";

// Admin Layout + Pages
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import AdminPayment from "./pages/AdminPayment";

// Student Layout + Pages
import StudentDashboard from "./pages/StudentDashboard";
import DashboardStudent from "./pages/Dashboard-student";
import StudentAttendance from "./pages/StudentAttendance";
import StudentPayment from "./pages/StudentPayment";

function App() {
  return (
    <Router>
      {/* ⭐ Global Toast Component */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          success: {
            style: { background: "#4A4947", color: "white", fontWeight: "600" },
          },
          error: {
            style: { background: "#FF3B30", color: "white", fontWeight: "600" },
          },
        }}
      />

      <div className="flex flex-col min-h-screen">

        <Routes>
          {/* ⭐ Public Routes */}
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
          <Route path="/courses" element={<><Navbar /><Courses /><Footer /></>} />
          <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
          <Route path="/testimonials" element={<><Navbar /><Testimonials /><Footer /></>} />
          <Route path="/gallery" element={<><Navbar /><Gallery /><Footer /></>} />
          <Route path="/login" element={<><Navbar /><LoginPage /><Footer /></>} />
          <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />

          {/* ⭐ Student Dashboard */}
          <Route path="/student" element={<StudentDashboard />}>
            <Route index element={<DashboardStudent />} />
            <Route path="student-dashboard" element={<DashboardStudent />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="payments" element={<StudentPayment />} />
          </Route>

          {/* ⭐ Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="payments" element={<AdminPayment />} />
          </Route>
        </Routes>

        {/* 📌 WhatsApp Floating Button always visible */}
        <Whatsapp />
      </div>
    </Router>
  );
}

export default App;
