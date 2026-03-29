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
      navigate("/login", { replace: true });
    } else {
      setAuthChecked(true);
    }
  }, [navigate]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking login…
      </div>
    );
  }

  return (
    <div className="flex">
      <StudentSidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-white md:ml-60">
        <div className="pl-14 md:pl-0">
          <Navbar />
        </div>
        <main className="flex-1 p-4 md:p-6 mt-2 md:mt-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}