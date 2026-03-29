import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
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
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen bg-white w-full md:ml-60">
        <Navbar isDashboard={true} onSidebarOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}