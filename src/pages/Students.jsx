import { useState } from "react";
import AddStudent from "./Students/AddStudent";
import StudentsList from "./Students/StudentsList";
import StudentProfile from "./Students/StudentProfile";

export default function Students() {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedStudent(null);
  };

  return (
    // ✅ Added relative + z-50 so this container sits above any navbar/logo overlay
    <div className="relative z-50 p-6 bg-white rounded-lg shadow-md">
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          className={`px-4 py-2 rounded cursor-pointer ${
            activeTab === "add" ? "bg-[#4A4947] text-white" : "bg-gray-200"
          }`}
          onClick={() => handleTabChange("add")}
        >
          + Add Students
        </button>

        <button
          type="button"
          className={`px-4 py-2 rounded cursor-pointer ${
            activeTab === "list" ? "bg-[#4A4947] text-white" : "bg-gray-200"
          }`}
          onClick={() => handleTabChange("list")}
        >
          Students List
        </button>
      </div>

      {activeTab === "add" && <AddStudent />}
      {activeTab === "list" && (
        <StudentsList onSelectStudent={setSelectedStudent} />
      )}
      {selectedStudent && <StudentProfile student={selectedStudent} />}
    </div>
  );
}
