import { NavLink } from "react-router-dom";

export default function StudentSidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-60 bg-[#4A4947] text-white flex flex-col">
      <h2 className="text-xl font-bold p-5 border-b border-gray-600">
        Student Panel
      </h2>
      <nav className="flex flex-col p-4 space-y-3">
        <NavLink
          to="/student/student-dashboard"
          className={({ isActive }) =>
            `p-2 rounded ${
              isActive ? "bg-gray-600 font-semibold" : "hover:bg-gray-700"
            }`
          }
        >
          Dashboard
        </NavLink>
        {/* <NavLink
          to="/student/courses"
          className={({ isActive }) =>
            `p-2 rounded ${
              isActive ? "bg-gray-600 font-semibold" : "hover:bg-gray-700"
            }`
          }
        >
          My Courses
        </NavLink> */}
        <NavLink
          to="/student/attendance"
          className={({ isActive }) =>
            `p-2 rounded ${
              isActive ? "bg-gray-600 font-semibold" : "hover:bg-gray-700"
            }`
          }
        >
          Attendance
        </NavLink>
        <NavLink
          to="/student/payments"
          className={({ isActive }) =>
            `p-2 rounded ${
              isActive ? "bg-gray-600 font-semibold" : "hover:bg-gray-700"
            }`
          }
        >
          Fees Record
        </NavLink>
        {/* <NavLink
          to="/student/profile"
          className={({ isActive }) =>
            `p-2 rounded ${
              isActive ? "bg-gray-600 font-semibold" : "hover:bg-gray-700"
            }`
          }
        >
          Profile
        </NavLink> */}
      </nav>
    </div>
  );
}
