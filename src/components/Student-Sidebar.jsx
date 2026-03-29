import { NavLink } from "react-router-dom";
import { X, LayoutDashboard, CalendarCheck, CreditCard } from "lucide-react";

const navItems = [
  { to: "/student/student-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/student/payments", label: "Fees Record", icon: CreditCard },
];

export default function StudentSidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-60 bg-[#4A4947] text-white flex flex-col z-50
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-600">
          <h2 className="text-lg font-bold leading-tight">Student Panel</h2>
          <button
            onClick={onClose}
            className="md:hidden text-white/80 hover:text-white"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-1 flex-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}