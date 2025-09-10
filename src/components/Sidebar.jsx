import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-60 bg-[#4A4947] text-white flex flex-col">
      <h2 className="text-xl font-bold p-5 border-b border-gray-600">VN Music Academy</h2>
      <nav className="flex flex-col p-4 space-y-3">
        <Link to="/admin/dashboard" className="hover:bg-gray-700 p-2 rounded">Dashboard</Link>
        <Link to="/admin/students" className="hover:bg-gray-700 p-2 rounded">Students</Link>
        <Link to="/admin/attendance" className="hover:bg-gray-700 p-2 rounded">Attendance</Link>
        <Link to="/admin/payments" className="hover:bg-gray-700 p-2 rounded">Fee Records</Link>
      </nav>
    </div>
  );
}
