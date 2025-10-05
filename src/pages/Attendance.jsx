import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Download, Filter, Plus, Search, Users, FileText, Grid, BarChart3, Eye, Edit, Trash2, X, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Initialize Supabase client
// ✅ Correct for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTiming, setSelectedTiming] = useState('6:00pm - 7:00pm');
  const [filterType, setFilterType] = useState('daily');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionTopic, setSessionTopic] = useState('');
  const [selectedStudentsForSession, setSelectedStudentsForSession] = useState(new Set());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showStudentSelection, setShowStudentSelection] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [sessionsCurrentPage, setSessionsCurrentPage] = useState(1);
const [attendanceCurrentPage, setAttendanceCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 20;
const [editingSession, setEditingSession] = useState(null);
const [editSessionName, setEditSessionName] = useState('');

  // Fetch students from Supabase
  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Fetch attendance records from Supabase (only present students)
  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          students (
            id,
            name,
            email,
            phone
          )
        `)
        .eq('status', 'present') // Only fetch present students
        .order('date', { ascending: false });
      
      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  // Create new session (with or without students)
const createSession = async () => {
  try {
    const sessionName = sessionTopic.trim() || null;

    const attendanceRecords = selectedStudentsForSession.size > 0
      ? Array.from(selectedStudentsForSession).map(studentId => ({
          student_id: studentId,
          date: selectedDate,
          timing: selectedTiming,
          status: 'present',
          session_name: sessionName
        }))
      : [{
          student_id: null,
          date: selectedDate,
          timing: selectedTiming,
          status: 'present',
          session_name: sessionName
        }];

    for (const record of attendanceRecords) {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('Error marking attendance:', data.error);
        alert('Error marking attendance: ' + data.error);
      } else {
        console.log('Attendance marked:', data);
      }
    }

    setShowCreateSession(false);
    setSessionTopic('');
    setSelectedStudentsForSession(new Set());
    setShowStudentSelection(false);
    fetchAttendance();
  } catch (error) {
    console.error('Error creating session:', error);
    alert('Error creating session. Please try again.');
  }
};



  // Add student to existing session
  const addStudentToSession = async (sessionDate, sessionTiming, sessionName) => {
    try {
      // Get available students (not already in this session)
      const existingAttendance = attendance.filter(record => 
        record.date === sessionDate && 
        record.timing === sessionTiming &&
        record.student_id !== null
      );
      
      const attendedStudentIds = existingAttendance.map(record => record.student_id);
      const availableStudents = students.filter(student => 
        !attendedStudentIds.includes(student.id)
      );

      if (availableStudents.length === 0) {
        alert('All students are already marked as present for this session.');
        return;
      }

      const studentId = prompt(`Select student to add:\n${availableStudents.map((student, index) => 
        `${index + 1}. ${student.name}`
      ).join('\n')}\n\nEnter the number:`);
      
      if (!studentId || isNaN(studentId) || studentId < 1 || studentId > availableStudents.length) {
        return;
      }

      const selectedStudent = availableStudents[parseInt(studentId) - 1];

      const { error } = await supabase
        .from('attendance')
        .insert([{
          student_id: selectedStudent.id,
          date: sessionDate,
          timing: sessionTiming,
          status: 'present',
          session_name: sessionName
        }]);
      
      if (error) throw error;
      fetchAttendance();
    } catch (error) {
      console.error('Error adding student to session:', error);
      alert('Error adding student. Please try again.');
    }
  };

  // Remove attendance record (since we only show present students, this effectively removes them)
  const removeAttendanceRecord = async (attendanceId) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', attendanceId);
      
      if (error) throw error;
      fetchAttendance();
    } catch (error) {
      console.error('Error removing attendance record:', error);
    }
  };

  // Toggle student selection for session
  const toggleStudentSelection = (studentId) => {
    const newSelection = new Set(selectedStudentsForSession);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudentsForSession(newSelection);
  };

  // Select all students
  const selectAllStudents = () => {
    setSelectedStudentsForSession(new Set(students.map(student => student.id)));
  };

  // Deselect all students
  const deselectAllStudents = () => {
    setSelectedStudentsForSession(new Set());
  };

  // Get filtered attendance data
  const getFilteredAttendance = () => {
    let filteredData = attendance.filter(record => record.student_id !== null); // Only show records with students

    // Filter by search term
    if (searchTerm) {
      filteredData = filteredData.filter(record => 
        record.students?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.session_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by student
    if (selectedStudent !== 'all') {
      filteredData = filteredData.filter(record => record.student_id === selectedStudent);
    }

    // Filter by date range
    const currentDate = new Date();
    if (filterType === 'weekly') {
      const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      filteredData = filteredData.filter(record => new Date(record.date) >= weekStart);
    } else if (filterType === 'monthly') {
      filteredData = filteredData.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() + 1 === selectedMonth && recordDate.getFullYear() === selectedYear;
      });
    } else if (filterType === 'daily') {
      filteredData = filteredData.filter(record => record.date === selectedDate);
    }

    return filteredData;
  };

  // Export to CSV
  const exportToCSV = () => {
    const filteredData = getFilteredAttendance();
    const csvContent = [
      ['Student Name', 'Date', 'Timing', 'Session Name', 'Email', 'Phone'],
      ...filteredData.map(record => [
        record.students?.name || '',
        record.date,
        record.timing,
        record.session_name || '',
        record.students?.email || '',
        record.students?.phone || ''
      ])
    ];

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${filterType}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Export to PDF using jsPDF
const exportToPDF = () => {
  const doc = new jsPDF();
  const filteredData = getFilteredAttendance();

  // Set title with custom color
  doc.setTextColor(74, 73, 71); // #4A4947
  doc.setFontSize(16);
  doc.text("Attendance Report - Present Students", 14, 15);

  const tableColumn = ["S.No.", "Student Name", "Date", "Time", "Session"];
  const tableRows = filteredData.map((record, index) => [
    (index + 1).toString(), // Serial number
    record.students?.name || "Unknown",
    record.date,
    record.timing,
    record.session_name || "N/A"
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 25,
    headStyles: {
      fillColor: [74, 73, 71], // #4A4947
      textColor: [255, 255, 255], // White
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      textColor: [74, 73, 71], // #4A4947
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245] // Light gray for alternate rows
    },
    columnStyles: {
      0: { cellWidth: 20 }, // S.No column width
      1: { cellWidth: 50 }, // Student Name column width
    }
  });

  doc.save(`attendance_present_${filterType}_${new Date().toISOString().split("T")[0]}.pdf`);
};

  // Get attendance statistics (only present students)
  const getAttendanceStats = () => {
    const filteredData = getFilteredAttendance();
    const totalRecords = filteredData.length;
    const uniqueDates = [...new Set(filteredData.map(record => `${record.date}-${record.timing}`))].length;
    const avgStudentsPerSession = uniqueDates > 0 ? (totalRecords / uniqueDates).toFixed(1) : 0;
    const uniqueSessions = [...new Set(filteredData.map(record => record.session_name || ''))].length;

    return { 
      totalRecords, 
      uniqueDates, 
      avgStudentsPerSession,
      totalStudents: students.length,
      uniqueSessions
    };
  };

  // Get unique sessions for current filters
  const getUniqueSessions = () => {
    const filteredData = getFilteredAttendance();
    const sessions = {};
    
    filteredData.forEach(record => {
      const sessionKey = `${record.date}-${record.timing}`;
      if (!sessions[sessionKey]) {
        sessions[sessionKey] = {
          date: record.date,
          timing: record.timing,
          session_name: record.session_name || '',
          students: []
        };
      }
      if (record.student_id) {
        sessions[sessionKey].students.push(record);
      }
    });
    
    return Object.values(sessions).sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  // Update session name
const updateSessionName = async (date, timing, oldSessionName) => {
  try {
    const { error } = await supabase
      .from('attendance')
      .update({ session_name: editSessionName })
      .eq('date', date)
      .eq('timing', timing)
      .eq('session_name', oldSessionName);
    
    if (error) throw error;
    setEditingSession(null);
    setEditSessionName('');
    fetchAttendance();
  } catch (error) {
    console.error('Error updating session name:', error);
    alert('Error updating session name. Please try again.');
  }
};

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStudents(), fetchAttendance()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const stats = getAttendanceStats();
  const filteredAttendance = getFilteredAttendance();
  const uniqueSessions = getUniqueSessions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  const getPaginatedSessions = () => {
  const startIndex = (sessionsCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return uniqueSessions.slice(startIndex, endIndex);
};

const getPaginatedAttendance = () => {
  const startIndex = (attendanceCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return filteredAttendance.slice(startIndex, endIndex);
};

const sessionsTotalPages = Math.ceil(uniqueSessions.length / ITEMS_PER_PAGE);
const attendanceTotalPages = Math.ceil(filteredAttendance.length / ITEMS_PER_PAGE);

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
        <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalPages * ITEMS_PER_PAGE)}</span>
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
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Attendance</h1>
              <p className="text-gray-600 mt-1">Manage and track class attendance</p>
            </div>
            <button
              onClick={() => setShowCreateSession(true)}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              New Session
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueDates}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Present Records</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRecords}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg per Session</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgStudentsPerSession}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueSessions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search students/sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            {/* Filter Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="all">All Time</option>
            </select>

            {/* Date Selection for Daily */}
            {filterType === 'daily' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            )}

            {/* Month/Year Selection for Monthly */}
            {filterType === 'monthly' && (
              <>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  min="2020"
                  max="2030"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </>
            )}

            {/* Student Filter */}
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="all">All Students</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                CSV
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FileText size={16} />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Sessions Overview ({uniqueSessions.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
<table className="w-full">
  <thead>
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Session
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Date & Time
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Students Present
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Actions
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
  {getPaginatedSessions().map((session, index) => {
    const globalIndex = (sessionsCurrentPage - 1) * ITEMS_PER_PAGE + index;
    const totalSessions = uniqueSessions.length;
    
    return (
      <tr key={`${session.date}-${session.timing}`} className="hover:bg-gray-50">
        {/* Serial Number + Session Name with inline editing */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-xs text-gray-500">
            {totalSessions - globalIndex}
          </div>
          {editingSession === `${session.date}-${session.timing}` ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={editSessionName}
                onChange={(e) => setEditSessionName(e.target.value)}
                className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Session name..."
                autoFocus
              />
              <button
                onClick={() => updateSessionName(session.date, session.timing, session.session_name)}
                className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
                title="Save"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => {
                  setEditingSession(null);
                  setEditSessionName('');
                }}
                className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                title="Cancel"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-900 font-medium mt-1">
              {session.session_name || ''}
            </div>
          )}
        </td>

        {/* Date & Time */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {new Date(session.date).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">
            {session.timing}
          </div>
        </td>

        {/* Students Present - Expandable List */}
        <td className="px-6 py-4">
          <div className="space-y-2">
            {session.students.slice(0, 3).map((student) => (
              <div key={student.id} className="flex items-center justify-between group">
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <span className="text-xs font-medium text-green-700">
                      {student.students?.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900">{student.students?.name}</span>
                </div>
                <button
                  onClick={() => removeAttendanceRecord(student.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                  title="Remove student"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {session.students.length > 3 && (
              <details className="text-sm">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  Show {session.students.length - 3} more...
                </summary>
                <div className="space-y-2 mt-2">
                  {session.students.slice(3).map((student) => (
                    <div key={student.id} className="flex items-center justify-between group">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-green-700">
                            {student.students?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">{student.students?.name}</span>
                      </div>
                      <button
                        onClick={() => removeAttendanceRecord(student.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                        title="Remove student"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </details>
            )}
            {session.students.length === 0 && (
              <span className="text-sm text-gray-500">No students</span>
            )}
          </div>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex gap-2">
            <button
              onClick={() => addStudentToSession(session.date, session.timing, session.session_name)}
              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              title="Add student to session"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => {
                setEditingSession(`${session.date}-${session.timing}`);
                setEditSessionName(session.session_name || '');
              }}
              className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              title="Edit session name"
            >
              <Edit size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>
</table>

{uniqueSessions.length > ITEMS_PER_PAGE && (
  <Pagination 
    currentPage={sessionsCurrentPage}
    totalPages={sessionsTotalPages}
    onPageChange={setSessionsCurrentPage}
  />
)}

{uniqueSessions.length === 0 && (
  <div className="text-center py-12">
    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
    <p className="mt-1 text-sm text-gray-500">
      No sessions match the selected filters.
    </p>
  </div>
)}


            
            
          </div>
        </div>

    

        {/* Create Session Modal */}
        {showCreateSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Create New Session</h3>
                  <button
                    onClick={() => {
                      setShowCreateSession(false);
                      setShowStudentSelection(false);
                      setSessionTopic('');
                      setSelectedStudentsForSession(new Set());
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timing
                    </label>
                    <select
                      value={selectedTiming}
                      onChange={(e) => setSelectedTiming(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="6:00pm - 7:00pm">6:00pm - 7:00pm</option>
                      <option value="7:00pm - 8:00pm">7:00pm - 8:00pm</option>
                      <option value="8:00pm - 9:00pm">8:00pm - 9:00pm</option>
                      <option value="10:00am - 11:00am">10:00am - 11:00am</option>
                      <option value="11:00am - 12:00pm">11:00am - 12:00pm</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Session Name <span className="text-gray-400 text-xs">(Optional)</span>
  </label>
  <input
    type="text"
    value={sessionTopic}
    onChange={(e) => setSessionTopic(e.target.value)}
    placeholder="Enter session name (optional)..."
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
  />
</div>


                {/* Option to add students */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      Add Students to Session (Optional)
                    </h4>
                    <button
                      onClick={() => setShowStudentSelection(!showStudentSelection)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center gap-2"
                    >
                      <Users size={16} />
                      {showStudentSelection ? 'Hide Students' : 'Select Students'}
                    </button>
                  </div>

                  {showStudentSelection && (
  <div>
    {/* Search Bar */}
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search students..."
          value={modalSearchTerm}
          onChange={(e) => setModalSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        />
      </div>
    </div>

    <div className="flex justify-between items-center mb-4">
      <span className="text-sm text-gray-600">
        {selectedStudentsForSession.size} student{selectedStudentsForSession.size !== 1 ? 's' : ''} selected
      </span>
      <div className="flex gap-2">
        <button
          onClick={selectAllStudents}
          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
        >
          Select All
        </button>
        <button
          onClick={deselectAllStudents}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Clear All
        </button>
      </div>
    </div>
    
    <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
      {students
        .filter(student => 
          student.name?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(modalSearchTerm.toLowerCase())
        )
        .map(student => (
        <div 
          key={student.id} 
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
            selectedStudentsForSession.has(student.id)
              ? 'bg-green-50 border border-green-200'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => toggleStudentSelection(student.id)}
        >
          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
            selectedStudentsForSession.has(student.id)
              ? 'bg-green-200'
              : 'bg-gray-300'
          }`}>
            {selectedStudentsForSession.has(student.id) ? (
              <Check size={16} className="text-green-700" />
            ) : (
              <span className="text-xs font-medium text-gray-700">
                {student.name?.charAt(0) || '?'}
              </span>
            )}
          </div>
          <div className="flex-1">
            <span className={`text-sm font-medium block ${
              selectedStudentsForSession.has(student.id)
                ? 'text-green-900'
                : 'text-gray-900'
            }`}>
              {student.name}
            </span>
            {student.email && (
              <span className="text-xs text-gray-500">{student.email}</span>
            )}
          </div>
        </div>
      ))}
      {students.filter(student => 
        student.name?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(modalSearchTerm.toLowerCase())
      ).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm">No students found</p>
        </div>
      )}
    </div>
  </div>
)}
                </div>

                {!showStudentSelection && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Calendar size={16} />
                      <span className="text-sm font-medium">Session will be created without students</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      You can add students to the session later from the Sessions Overview table.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCreateSession(false);
                      setShowStudentSelection(false);
                      setSessionTopic('');
                      setSelectedStudentsForSession(new Set());
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
  onClick={createSession}
  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
>
  <Plus size={16} />
  Create Session
  {selectedStudentsForSession.size > 0 && (
    <span className="bg-gray-700 px-2 py-1 rounded-full text-xs">
      {selectedStudentsForSession.size}
    </span>
  )}
</button>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;