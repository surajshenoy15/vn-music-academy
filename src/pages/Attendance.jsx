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
    if (!sessionTopic.trim()) {
      alert('Please enter a session name');
      return;
    }
    
    try {
      if (selectedStudentsForSession.size === 0) {
        // Create session with no students - just insert one record with null student_id
        const { error } = await supabase
          .from('attendance')
          .insert([{
            student_id: null,
            date: selectedDate,
            timing: selectedTiming,
            status: 'present',
            session_name: sessionTopic.trim()
          }]);
        
        if (error) throw error;
      } else {
        // Create attendance records for selected students
        const attendanceRecords = Array.from(selectedStudentsForSession).map(studentId => ({
          student_id: studentId,
          date: selectedDate,
          timing: selectedTiming,
          status: 'present',
          session_name: sessionTopic.trim()
        }));

        const { error } = await supabase
          .from('attendance')
          .insert(attendanceRecords);
        
        if (error) throw error;
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

    doc.text("Attendance Report - Present Students", 14, 15);

    const tableColumn = ["Student Name", "Date", "Time", "Session"];
    const tableRows = filteredData.map(record => [
      record.students?.name || "Unknown",
      record.date,
      record.timing,
      record.session_name || "N/A"
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save(`attendance_present_${filterType}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Get attendance statistics (only present students)
  const getAttendanceStats = () => {
    const filteredData = getFilteredAttendance();
    const totalRecords = filteredData.length;
    const uniqueDates = [...new Set(filteredData.map(record => `${record.date}-${record.timing}`))].length;
    const avgStudentsPerSession = uniqueDates > 0 ? (totalRecords / uniqueDates).toFixed(1) : 0;
    const uniqueSessions = [...new Set(filteredData.map(record => record.session_name || 'Unnamed'))].length;

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
          session_name: record.session_name || 'Unnamed Session',
          students: []
        };
      }
      if (record.student_id) {
        sessions[sessionKey].students.push(record);
      }
    });
    
    return Object.values(sessions).sort((a, b) => new Date(b.date) - new Date(a.date));
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
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Name
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
                {uniqueSessions.map((session, index) => (
                  <tr key={`${session.date}-${session.timing}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {session.session_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {session.timing}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-2">
                          {session.students.length}
                        </span>
                        <div className="flex -space-x-1">
                          {session.students.slice(0, 3).map((student, i) => (
                            <div
                              key={student.id}
                              className="h-6 w-6 rounded-full bg-green-100 border border-white flex items-center justify-center"
                              title={student.students?.name}
                            >
                              <span className="text-xs font-medium text-green-700">
                                {student.students?.name?.charAt(0) || '?'}
                              </span>
                            </div>
                          ))}
                          {session.students.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-gray-100 border border-white flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700">
                                +{session.students.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => addStudentToSession(session.date, session.timing, session.session_name)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors mr-2"
                        title="Add student to session"
                      >
                        <Plus size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
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

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Present Students ({filteredAttendance.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-green-700">
                            {record.students?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.students?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.students?.email || ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {record.session_name || 'Unnamed Session'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.timing}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => removeAttendanceRecord(record.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Remove from session"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredAttendance.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No students present</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No students were present for the selected filters.
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
                    Session Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    placeholder="Enter session name..."
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
                        {students.map(student => (
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
                            <span className={`text-sm font-medium ${
                              selectedStudentsForSession.has(student.id)
                                ? 'text-green-900'
                                : 'text-gray-900'
                            }`}>
                              {student.name}
                            </span>
                          </div>
                        ))}
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
                    disabled={!sessionTopic.trim()}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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