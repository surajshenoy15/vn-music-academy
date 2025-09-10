import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import StudentSidebar from "../components/Student-Sidebar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("studentToken");

    if (!token) {
      // No token → redirect immediately
      navigate("/login", { replace: true });
    } else {
      // Token exists → allow render
      setAuthChecked(true);
    }
  }, [navigate]);

  if (!authChecked) {
    // Prevent rendering dashboard before auth check is done
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking login…
      </div>
    );
  }

  return (
    <div className="flex">
      <StudentSidebar />
      <div className="ml-60 flex-1 flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1 p-6 mt-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
