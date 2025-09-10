import { useEffect, useState } from "react";
import { Search, Eye, Users, Mail, Phone, BookOpen, Calendar, Hash, Loader2, AlertCircle, RefreshCw, Plus, Edit, Trash2, Upload, X, User, Check, Camera,ChevronDown, Music } from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function StudentsList({ onSelectStudent, refreshTrigger }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  // Edit modal state
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Delete confirmation state
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Profile picture state
  const [uploadingProfilePic, setUploadingProfilePic] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  // Re-fetch when refreshTrigger changes (when new student is added)
  useEffect(() => {
    if (refreshTrigger) {
      fetchStudents();
    }
  }, [refreshTrigger]);

  // Set up real-time subscription for automatic updates
  useEffect(() => {
    const subscription = supabase
      .channel('students-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          handleRealTimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRealTimeUpdate = (payload) => {
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


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
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
  };

  // Edit functionality
  const handleEditClick = (student) => {
    setEditingStudent(student);
    setEditFormData({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      course: student.course || '',
      age: student.age || ''
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(true);
    
    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone,
          course: editFormData.course,
          age: editFormData.age ? parseInt(editFormData.age, 10) : null
        })
        .eq('id', editingStudent.id);

      if (error) throw error;

      // Update local state
      setStudents(students.map(student => 
        student.id === editingStudent.id 
          ? { ...student, ...editFormData, age: editFormData.age ? parseInt(editFormData.age, 10) : null }
          : student
      ));

      setEditingStudent(null);
      setEditFormData({});
    } catch (err) {
      console.error('Error updating student:', err);
      setError(err.message);
    } finally {
      setIsEditing(false);
    }
  };

  // Delete functionality
  const handleDeleteClick = (student) => {
    setDeletingStudent(student);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', deletingStudent.id);

      if (error) throw error;

      // Update local state
      setStudents(students.filter(student => student.id !== deletingStudent.id));
      setDeletingStudent(null);
    } catch (err) {
      console.error('Error deleting student:', err);
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Profile picture functionality
  const handleProfilePicClick = (student) => {
    setUploadingProfilePic(student);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfilePicFile(file);
    }
  };

  const handleProfilePicUpload = async () => {
    if (!profilePicFile || !uploadingProfilePic) return;

    try {
      // Create a file path
      const fileExt = profilePicFile.name.split('.').pop();
      const fileName = `${uploadingProfilePic.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pics/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('student-profiles')
        .upload(filePath, profilePicFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('student-profiles')
        .getPublicUrl(filePath);

      // Update student record with profile pic URL
      const { error: updateError } = await supabase
        .from('students')
        .update({ profile_pic: urlData.publicUrl })
        .eq('id', uploadingProfilePic.id);

      if (updateError) throw updateError;

      // Update local state
      setStudents(students.map(student => 
        student.id === uploadingProfilePic.id 
          ? { ...student, profile_pic: urlData.publicUrl }
          : student
      ));

      setUploadingProfilePic(null);
      setProfilePicFile(null);
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError(err.message);
    }
  };

  const handleRemoveProfilePic = async (student) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ profile_pic: null })
        .eq('id', student.id);

      if (error) throw error;

      // Update local state
      setStudents(students.map(s => 
        s.id === student.id ? { ...s, profile_pic: null } : s
      ));
    } catch (err) {
      console.error('Error removing profile picture:', err);
      setError(err.message);
    }
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (student.name && student.name.toLowerCase().includes(searchLower)) ||
      (student.email && student.email.toLowerCase().includes(searchLower)) ||
      (student.course && student.course.toLowerCase().includes(searchLower)) ||
      (student.phone && student.phone.toLowerCase().includes(searchLower))
    );
  });

  const handleViewStudent = (student) => {
    if (onSelectStudent) {
      onSelectStudent(student);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4 max-w-sm w-full">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#4A4947' }} />
          <div className="text-center">
            <h3 className="text-lg font-semibold" style={{ color: '#4A4947' }}>Loading Students</h3>
            <p className="text-gray-600 text-sm mt-1">Please wait while we fetch the data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Students</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg flex items-center space-x-2 mx-auto"
            style={{ backgroundColor: '#4A4947' }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl shadow-lg bg-white">
                <Users className="w-8 h-8" style={{ color: '#4A4947' }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#4A4947' }}>Students Directory</h1>
                <p className="text-gray-600">Manage and view all registered students</p>
              </div>
            </div>
            
            {/* Real-time indicator */}
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Live Updates</span>
            </div>
          </div>
          
          {/* Search and Stats Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name, email, course, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                style={{ 
                  '--tw-ring-color': '#4A4947',
                  '--tw-ring-opacity': '0.3'
                }}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center px-4">
                <div className="text-2xl font-bold" style={{ color: '#4A4947' }}>{filteredStudents.length}</div>
                <div className="text-sm text-gray-600">Students Found</div>
              </div>
              
              <div className="text-center px-4">
                <div className="text-2xl font-bold" style={{ color: '#4A4947' }}>{students.length}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 rounded-xl text-white transition-all duration-200 hover:shadow-lg disabled:opacity-70 flex items-center space-x-2"
                style={{ backgroundColor: '#4A4947' }}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Students Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Try adjusting your search terms" : "No students have been registered yet"}
            </p>
            {!searchTerm && (
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add your first student to get started</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#4A4947' }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Profile</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4" />
                        <span>Student ID</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Name</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Phone</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Course</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Age</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="relative group">
                            {student.profile_pic ? (
                              <img 
                                src={student.profile_pic} 
                                alt={student.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <button
                              onClick={() => handleProfilePicClick(student)}
                              className="absolute -bottom-1 -right-1 bg-gray-600 hover:bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Camera className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-mono text-gray-500">{student.id.slice(0, 8)}...</span>
                          {student.joined_at && (
                            <span className="text-xs text-gray-400 mt-1">
                              Joined: {new Date(student.joined_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold" style={{ color: '#4A4947' }}>
                          {student.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700">{student.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700">{student.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {student.course || 'No Course'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700">{student.age || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="p-2 rounded-lg text-white transition-all duration-200 hover:shadow-md"
                            style={{ backgroundColor: '#4A4947' }}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditClick(student)}
                            className="p-2 rounded-lg bg-blue-600 text-white transition-all duration-200 hover:shadow-md hover:bg-blue-700"
                            title="Edit Student"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(student)}
                            className="p-2 rounded-lg bg-red-600 text-white transition-all duration-200 hover:shadow-md hover:bg-red-700"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 p-6">
              {filteredStudents.map((student) => (
                <div key={student.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative group">
                        {student.profile_pic ? (
                          <img 
                            src={student.profile_pic} 
                            alt={student.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <button
                          onClick={() => handleProfilePicClick(student)}
                          className="absolute -bottom-1 -right-1 bg-gray-600 hover:bg-gray-700 text-white rounded-full p-1"
                        >
                          <Camera className="w-3 h-3" />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: '#4A4947' }}>
                          {student.name}
                        </h3>
                        <p className="text-sm text-gray-600">ID: {student.id.slice(0, 8)}...</p>
                        {student.joined_at && (
                          <p className="text-xs text-gray-500">
                            Joined: {new Date(student.joined_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="p-2 rounded-lg text-white transition-all duration-200 hover:shadow-md"
                        style={{ backgroundColor: '#4A4947' }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(student)}
                        className="p-2 rounded-lg bg-blue-600 text-white transition-all duration-200 hover:shadow-md"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(student)}
                        className="p-2 rounded-lg bg-red-600 text-white transition-all duration-200 hover:shadow-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{student.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{student.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-white text-gray-700">
                        {student.course || 'No Course Assigned'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{student.age ? `${student.age} years old` : 'Age not provided'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#4A4947' }}>Edit Student</h2>
                <button
                  onClick={() => setEditingStudent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
<form onSubmit={handleEditSubmit} className="space-y-4">
  {/* Name */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
    <input
      type="text"
      name="name"
      value={editFormData.name}
      onChange={handleEditChange}
      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
      style={{ '--tw-ring-color': '#4A4947' }}
      required
    />
  </div>

  {/* Email */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
    <input
      type="email"
      name="email"
      value={editFormData.email}
      onChange={handleEditChange}
      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
      style={{ '--tw-ring-color': '#4A4947' }}
      required
    />
  </div>

  {/* Phone */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
    <input
      type="tel"
      name="phone"
      value={editFormData.phone}
      onChange={handleEditChange}
      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
      style={{ '--tw-ring-color': '#4A4947' }}
    />
  </div>

  {/* Course Dropdown */}
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
    <button
      type="button"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className="relative w-full px-3 py-3 text-left bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A4947] focus:border-transparent"
    >
      <span className={editFormData.course ? "text-gray-900" : "text-gray-400"}>
        {editFormData.course || "Select a course"}
      </span>
      <ChevronDown
        className={`absolute right-3 top-3 h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
          isDropdownOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {isDropdownOpen && (
      <div className="absolute left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
        {["Guitar", "Piano or Keyboard", "Music Production"].map((course, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              setEditFormData((prev) => ({ ...prev, course }));
              setIsDropdownOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-gray-900 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
          >
            {course}
          </button>
        ))}
      </div>
    )}
  </div>

  {/* Age */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
    <input
      type="number"
      name="age"
      value={editFormData.age}
      onChange={handleEditChange}
      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
      style={{ '--tw-ring-color': '#4A4947' }}
    />
  </div>

  {/* Buttons */}
  <div className="flex space-x-3 pt-4">
    <button
      type="button"
      onClick={() => setEditingStudent(null)}
      className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isEditing}
      className="flex-1 py-3 text-white rounded-lg hover:shadow-lg disabled:opacity-70 flex items-center justify-center"
      style={{ backgroundColor: '#4A4947' }}
    >
      {isEditing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Saving...
        </>
      ) : (
        <>
          <Check className="w-4 h-4 mr-2" />
          Save Changes
        </>
      )}
    </button>
  </div>
</form>


            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Student</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete <strong>{deletingStudent.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setDeletingStudent(null)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70 flex items-center justify-center"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Picture Upload Modal */}
        {uploadingProfilePic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#4A4947' }}>Update Profile Picture</h2>
                <button
                  onClick={() => {
                    setUploadingProfilePic(null);
                    setProfilePicFile(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="mx-auto w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-gray-200">
                  {uploadingProfilePic.profile_pic ? (
                    <img 
                      src={uploadingProfilePic.profile_pic} 
                      alt={uploadingProfilePic.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{uploadingProfilePic.name}</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose new profile picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#4A4947' }}
                  />
                </div>

                {profilePicFile && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      Selected: {profilePicFile.name}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  {uploadingProfilePic.profile_pic && (
                    <button
                      onClick={() => handleRemoveProfilePic(uploadingProfilePic)}
                      className="flex-1 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      Remove Photo
                    </button>
                  )}
                  <button
                    onClick={handleProfilePicUpload}
                    disabled={!profilePicFile}
                    className="flex-1 py-3 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ backgroundColor: '#4A4947' }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}