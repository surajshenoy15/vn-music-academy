import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar"; // ✅ Import Navbar
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-60 flex-1 flex flex-col min-h-screen bg-white">
        {/* Navbar at top */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 p-6 mt-4">
          <Outlet /> {/* ✅ This renders Dashboard, Students, or Attendance */}
        </main>

        <Footer />
      </div>
    </div>
  );
}
