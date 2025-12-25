import React, { useState, useEffect } from 'react';
import { Users, BookOpen, CalendarCheck, DollarSign, Bell, X, Check, Trash2, Edit3, AlertCircle, TrendingUp, Mail, Phone, RefreshCw, Database } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? <Check size={16} /> : type === 'error' ? <AlertCircle size={16} /> : <Bell size={16} />;

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-80 animate-slide-in`}>
      {icon}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="hover:bg-black/20 p-1 rounded">
        <X size={16} />
      </button>
    </div>
  );
};

// Application Form Modal
const ApplicationModal = ({ application, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(application || {
    name: '',
    email: '',
    phone: '',
    course: '',
    status: 'pending'
  });

  useEffect(() => {
    if (application) {
      setFormData(application);
    }
  }, [application]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold" style={{color: '#4A4947'}}>
            {application ? 'Edit Application' : 'New Application'}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{color: '#4A4947'}}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{color: '#4A4947'}}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{color: '#4A4947'}}>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{color: '#4A4947'}}>Course</label>
            <select
              value={formData.course}
              onChange={(e) => setFormData({...formData, course: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Course</option>
              <option value="Keyboard">Keyboard</option>
              <option value="Guitar">Guitar</option>
              <option value="Music Production">Music Production</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{color: '#4A4947'}}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
            style={{backgroundColor: '#4A4947'}}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Dashboard loaded successfully", type: "success", time: "Just now" },
  ]);

  // Calculate stats from real data
  const stats = {
    totalStudents: students.length,
    totalCourses: [...new Set(students.map(s => s.course))].length || 3,
    avgAttendance: 85, // This would need to come from attendance data
    revenue: students.reduce((total, student) => total + (student.fee_paid || 0), 0)
  };

  // Handle real-time updates for students
  const handleStudentsRealTimeUpdate = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    setStudents(currentStudents => {
      switch (eventType) {
        case 'INSERT':
          return [...currentStudents, newRecord];
        
        case 'UPDATE':
          return currentStudents.map(student => 
            student.id === newRecord.id ? newRecord : student
          );
        
        case 'DELETE':
          return currentStudents.filter(student => student.id !== oldRecord.id);
        
        default:
          return currentStudents;
      }
    });
  };

  // Handle real-time updates for applications
  const handleApplicationsRealTimeUpdate = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    setApplications(currentApplications => {
      switch (eventType) {
        case 'INSERT':
          return [...currentApplications, newRecord];
        
        case 'UPDATE':
          return currentApplications.map(application => 
            application.id === newRecord.id ? newRecord : application
          );
        
        case 'DELETE':
          return currentApplications.filter(application => application.id !== oldRecord.id);
        
        default:
          return currentApplications;
      }
    });
  };

  // Fetch students from Supabase
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order('joined_at', { ascending: false });
      
      if (error) throw error;
      setStudents(data || []);
      
    } catch (err) {
      setError(err.message);
      console.error("Error fetching students:", err);
      showToast(`Error fetching students: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications from Supabase
  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setApplications(data || []);
      
    } catch (err) {
      setError(err.message);
      console.error("Error fetching applications:", err);
      showToast(`Error fetching applications: ${err.message}`, 'error');
    } finally {
      setApplicationsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStudents();
    fetchApplications();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const studentsSubscription = supabase
      .channel('students-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students'
        },
        (payload) => {
          console.log('Students real-time update received:', payload);
          handleStudentsRealTimeUpdate(payload);
        }
      )
      .subscribe();

    const applicationsSubscription = supabase
      .channel('applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        (payload) => {
          console.log('Applications real-time update received:', payload);
          handleApplicationsRealTimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      studentsSubscription.unsubscribe();
      applicationsSubscription.unsubscribe();
    };
  }, []);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleEditApplication = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleSaveApplication = async (formData) => {
    try {
      if (selectedApplication) {
        // Update existing application
        const { error } = await supabase
          .from('applications')
          .update(formData)
          .eq('id', selectedApplication.id);

        if (error) {
          showToast(`Error updating application: ${error.message}`, 'error');
          return;
        }
        showToast('Application updated successfully', 'success');
      } else {
        // Add new application
        const { error } = await supabase
          .from('applications')
          .insert([formData]);

        if (error) {
          showToast(`Error adding application: ${error.message}`, 'error');
          return;
        }
        showToast('Application added successfully', 'success');
      }
      
      // Refresh applications data
      fetchApplications();
    } catch (error) {
      console.error('Error saving application:', error);
      showToast('Failed to save application', 'error');
    }
    
    setSelectedApplication(null);
  };

  const handleDeleteApplication = async (id) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) {
        showToast(`Error deleting application: ${error.message}`, 'error');
        return;
      }

      showToast('Application deleted successfully', 'success');
      fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      showToast('Failed to delete application', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <Check size={12} />;
      case 'rejected': return <X size={12} />;
      default: return <AlertCircle size={12} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{color: '#4A4947'}}>
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell size={24} style={{color: '#4A4947'}} className="cursor-pointer" />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex items-center gap-4 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl flex-shrink-0">
              <Users size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500">Total Students</p>
              <h2 className="text-xl sm:text-2xl font-semibold" style={{color: '#4A4947'}}>
                {stats.totalStudents}
              </h2>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp size={12} />
                <span>Live</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex items-center gap-4 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 text-green-600 p-3 rounded-xl flex-shrink-0">
              <BookOpen size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500">Total Courses</p>
              <h2 className="text-xl sm:text-2xl font-semibold" style={{color: '#4A4947'}}>
                {stats.totalCourses}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex items-center gap-4 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-xl flex-shrink-0">
              <CalendarCheck size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500">Avg. Attendance</p>
              <h2 className="text-xl sm:text-2xl font-semibold" style={{color: '#4A4947'}}>
                {stats.avgAttendance}%
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex items-center gap-4 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl flex-shrink-0">
              <DollarSign size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500">Revenue</p>
              <h2 className="text-xl sm:text-2xl font-semibold" style={{color: '#4A4947'}}>
                ₹{stats.revenue.toLocaleString()}
              </h2>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp size={12} />
                <span>Live</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4" style={{color: '#4A4947'}}>
              Recent Activity
            </h3>
            <ul className="space-y-3 text-sm">
              {notifications.map((notif) => (
                <li key={notif.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-1 rounded-full flex-shrink-0 ${
                    notif.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {notif.type === 'success' ? <Check size={12} /> : <Bell size={12} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{color: '#4A4947'}}>{notif.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{notif.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4" style={{color: '#4A4947'}}>
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Applications</span>
                <span className="font-semibold text-yellow-600">
                  {applications.filter(app => app.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved Applications</span>
                <span className="font-semibold text-green-600">
                  {applications.filter(app => app.status === 'approved').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rejected Applications</span>
                <span className="font-semibold text-red-600">
                  {applications.filter(app => app.status === 'rejected').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold" style={{color: '#4A4947'}}>
              Current Students ({students.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 font-medium text-gray-600">Name</th>
                  <th className="text-left p-4 font-medium text-gray-600 hidden sm:table-cell">Email</th>
                  <th className="text-left p-4 font-medium text-gray-600 hidden md:table-cell">Phone</th>
                  <th className="text-left p-4 font-medium text-gray-600">Course</th>
                  <th className="text-left p-4 font-medium text-gray-600 hidden lg:table-cell">Fee Paid</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw size={20} className="animate-spin" />
                        Loading students data...
                      </div>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Database size={20} />
                        No students found
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="font-medium" style={{color: '#4A4947'}}>
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 sm:hidden flex items-center gap-1">
                            <Mail size={12} />
                            {student.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} />
                          {student.email}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={16} />
                          {student.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                          {student.course}
                        </span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="font-medium text-green-600">
                          ₹{(student.fee_paid || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          student.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status || 'active'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Applications */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-semibold" style={{color: '#4A4947'}}>
              Student Applications ({applications.length})
            </h3>
            <button
              onClick={() => {
                setSelectedApplication(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
              style={{backgroundColor: '#4A4947'}}
            >
              Add New Application
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 font-medium text-gray-600">Name</th>
                  <th className="text-left p-4 font-medium text-gray-600 hidden sm:table-cell">Email</th>
                  <th className="text-left p-4 font-medium text-gray-600 hidden md:table-cell">Phone</th>
                  <th className="text-left p-4 font-medium text-gray-600">Course</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicationsLoading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw size={20} className="animate-spin" />
                        Loading applications...
                      </div>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Database size={20} />
                        No applications found
                      </div>
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => (
                    <tr key={application.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="font-medium" style={{color: '#4A4947'}}>
                            {application.name}
                          </div>
                          <div className="text-sm text-gray-500 sm:hidden flex items-center gap-1">
                            <Mail size={12} />
                            {application.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} />
                          {application.email}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={16} />
                          {application.phone}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 text-sm rounded-full bg-gray-100" style={{color: '#4A4947'}}>
                          {application.course}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 w-fit ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditApplication(application)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteApplication(application.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* Application Modal */}
      <ApplicationModal
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplication(null);
        }}
        onSave={handleSaveApplication}
      />

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}