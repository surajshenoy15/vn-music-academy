import { useState } from "react";
import AddStudent from "./Students/AddStudent";
import StudentsList from "./Students/StudentsList";
import StudentProfile from "./Students/StudentProfile";

export default function Students() {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "add" ? "bg-[#4A4947] text-white" : "bg-gray-200"}`}
          onClick={() => { setActiveTab("add"); setSelectedStudent(null); }}
        >
          + Add Students
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "list" ? "bg-[#4A4947] text-white" : "bg-gray-200"}`}
          onClick={() => { setActiveTab("list"); setSelectedStudent(null); }}
        >
          Students List
        </button>
      </div>

      {activeTab === "add" && <AddStudent />}
      {activeTab === "list" && <StudentsList onSelectStudent={setSelectedStudent} />}
      {selectedStudent && <StudentProfile student={selectedStudent} />}
    </div>
  );
}
