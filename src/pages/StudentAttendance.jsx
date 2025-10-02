import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Book,
  BarChart3,
  TrendingUp,
  Award,
  GraduationCap,
  Users,
  FileText,
  Download,
  Search,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Supabase client - keeping exact same configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const StudentAttendance = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 20;
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    rate: 0,
  });

  // ✅ Keeping exact same fetch logic from original code
  const fetchStudentData = async () => {
    try {
      const storedData = localStorage.getItem("studentData");
      if (!storedData) {
        alert("⚠️ No student found, please login again.");
        setLoading(false);
        return;
      }

      const studentObj = JSON.parse(storedData);
      console.log("📌 Loaded studentData:", studentObj);

      setStudent(studentObj);

      // Use email to fetch student row
      const { data: studentRow, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("email", studentObj.email)
        .single();

      if (studentError || !studentRow) {
        console.error("❌ Student fetch error:", studentError);
        alert("Student not found in DB.");
        setLoading(false);
        return;
      }

      // Fetch attendance
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", studentRow.id)
        .order("date", { ascending: false });

      if (attendanceError) {
        console.error("❌ Attendance fetch error:", attendanceError);
      }

      setAttendance(attendanceData || []);
      calculateStats(attendanceData || []);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
    setLoading(false);
  };

  // ✅ Keeping exact same stats calculation
  const calculateStats = (data) => {
    const total = data.length;
    const present = data.filter((r) => r.status === "present").length;
    const absent = total - present;
    const rate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    setStats({ total, present, absent, rate });
  };

  // Get filtered attendance data
  const getFilteredAttendance = () => {
    let filteredData = [...attendance];

    // Filter by search term
    if (searchTerm) {
      filteredData = filteredData.filter(record => 
        record.session_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    const currentDate = new Date();
    if (filterType === 'weekly') {
      const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      filteredData = filteredData.filter(record => new Date(record.date) >= weekStart);
    } else if (filterType === 'monthly') {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      filteredData = filteredData.filter(record => new Date(record.date) >= monthStart);
    }

    return filteredData;
  };

  // Export to CSV
  const exportToCSV = () => {
    const filteredData = getFilteredAttendance();
    const csvContent = [
      ['Date', 'Session Name', 'Timing', 'Status'],
      ...filteredData.map(record => [
        record.date,
        record.session_name || '',
        record.timing,
        record.status
      ])
    ];

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_attendance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, filterType]);

  // ✅ Keeping same helper functions
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB");

  const getStatusBadge = (status) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${
      status === "present"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`}>
      {status === "present" ? (
        <CheckCircle size={12} />
      ) : (
        <XCircle size={12} />
      )}
      {status}
    </span>
  );

  const filteredAttendance = getFilteredAttendance();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl border border-red-100">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 font-semibold text-lg">No student found. Please login.</p>
          </div>
        </div>
      </div>
    );
  }


  // Pagination helpers
const getPaginatedAttendance = () => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return filteredAttendance.slice(startIndex, endIndex);
};

const totalPages = Math.ceil(filteredAttendance.length / ITEMS_PER_PAGE);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to{' '}
        <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAttendance.length)}</span> of{' '}
        <span className="font-medium">{filteredAttendance.length}</span> results
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          Previous
        </button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                currentPage === page
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Modern styling like admin */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-gray-900 p-2 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                My Attendance Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                {student.name} • {student.email}
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards - Following admin design pattern */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {stats.rate}%
                  {parseFloat(stats.rate) >= 80 && <Award className="w-5 h-5 text-yellow-500" />}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search - Admin style */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>

            <div className="flex items-center text-sm text-gray-600">
              <FileText size={16} className="mr-2" />
              Showing {filteredAttendance.length} of {attendance.length} records
            </div>
          </div>
        </div>

        {/* Attendance Table - Admin design */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <Book className="h-5 w-5 text-gray-600" />
              Attendance History ({filteredAttendance.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
  {getPaginatedAttendance().map((record) => (
    <tr key={record.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {formatDate(record.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {record.session_name || "Regular Session"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={14} />
          {record.timing}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(record.status)}
      </td>
    </tr>
  ))}
</tbody>
            </table>
            
            {filteredAttendance.length > ITEMS_PER_PAGE && (
  <Pagination 
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />
)}

{filteredAttendance.length === 0 && (
  <div className="text-center py-12">
    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records found</h3>
    <p className="mt-1 text-sm text-gray-500">
      {searchTerm || filterType !== 'all' 
        ? 'Try adjusting your filters or search term.'
        : 'Your attendance history will appear here once recorded.'
      }
    </p>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;