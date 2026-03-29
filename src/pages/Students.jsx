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
    <div className="w-full">
      {/* Tab buttons */}
      <div className="flex gap-3 mb-4 px-1">
        <button
          type="button"
          className={`px-4 py-2 rounded text-sm font-medium cursor-pointer transition-colors ${
            activeTab === "add" ? "bg-[#4A4947] text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => handleTabChange("add")}
        >
          + Add Students
        </button>

        <button
          type="button"
          className={`px-4 py-2 rounded text-sm font-medium cursor-pointer transition-colors ${
            activeTab === "list" ? "bg-[#4A4947] text-white" : "bg-gray-200 hover:bg-gray-300"
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