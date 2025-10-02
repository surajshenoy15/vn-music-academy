import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { User, Mail, Phone, Clock, AlertCircle, RefreshCw, Calendar, CheckCircle, XCircle, MessageSquare, TrendingUp, Edit3, Save, X, Upload, Image } from "lucide-react";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DashboardStudent() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 20;
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    age: "",
    profile_pic: ""
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  console.log("Dashboard component is rendering!");
  console.log("Current attendance:", attendance);

  // Fetch student info from localStorage
  useEffect(() => {
    console.log("useEffect running...");
    const storedStudent = localStorage.getItem("studentData");
    if (!storedStudent) {
      setError("Not logged in. Please log in first.");
      setLoading(false);
      return;
    }

    try {
      const parsedStudent = JSON.parse(storedStudent);
      console.log("Parsed student:", parsedStudent);
      setStudent(parsedStudent);
      
      // Initialize edit form with current data
      setEditForm({
        name: parsedStudent.name || "",
        email: parsedStudent.email || "",
        phone: parsedStudent.phone || "",
        course: parsedStudent.course || "",
        age: parsedStudent.age || "",
        profile_pic: parsedStudent.profile_pic || ""
      });

      // Fetch attendance & feedback
      fetchAttendance(parsedStudent.id);
      fetchFeedback(parsedStudent.email);
    } catch (err) {
      console.error("Failed to parse studentData:", err);
      setError("Invalid login data. Please log in again.");
      setLoading(false);
    }
  }, []);

  // Fetch attendance
  const fetchAttendance = async (studentId) => {
    console.log("Fetching attendance for student:", studentId);
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", studentId)
        .order("date", { ascending: false });

      if (error) throw error;
      console.log("Fetched attendance data:", data);
      setAttendance(data || []);
    } catch (err) {
      console.error("Attendance fetch error:", err);
      setError("Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedback from Supabase
  const fetchFeedback = async (email) => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("feedback")
        .eq("student_email", email)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      if (data) setFeedback(data.feedback);
    } catch (err) {
      console.error("Feedback fetch error:", err);
    }
  };

  // Handle image file selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB.');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert image to Base64 for storage (fallback solution)
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload image to Supabase Storage (with fallback to Base64)
  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${student.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pics/${fileName}`;

      // Try Supabase Storage first
      const { error: uploadError } = await supabase.storage
        .from('student-images')
        .upload(filePath, file);

      if (uploadError) {
        console.warn('Supabase storage not available, using Base64 fallback:', uploadError.message);
        // Fallback to Base64 storage
        const base64Image = await convertImageToBase64(file);
        return base64Image;
      }

      // Get public URL if upload successful
      const { data: { publicUrl } } = supabase.storage
        .from('student-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      // Final fallback to Base64
      try {
        console.log('Attempting Base64 conversion as final fallback...');
        const base64Image = await convertImageToBase64(file);
        return base64Image;
      } catch (base64Error) {
        console.error('Base64 conversion failed:', base64Error);
        throw new Error('Failed to process image. Please try a different image or use an image URL instead.');
      }
    }
  };

  // Update profile
  const updateProfile = async () => {
    setUpdateLoading(true);
    try {
      let profilePicUrl = editForm.profile_pic;

      // Upload new image if selected
      if (imageFile) {
        profilePicUrl = await uploadImage(imageFile);
      }

      const { data, error } = await supabase
        .from("students")
        .update({
          name: editForm.name,
          phone: editForm.phone,
          course: editForm.course,
          age: editForm.age ? parseInt(editForm.age) : null,
          profile_pic: profilePicUrl
        })
        .eq("id", student.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state and localStorage
      const updatedStudent = { ...student, ...data };
      setStudent(updatedStudent);
      localStorage.setItem("studentData", JSON.stringify(updatedStudent));
      
      // Reset form state
      setIsEditing(false);
      setImageFile(null);
      setImagePreview("");
      
      alert('Profile updated successfully!');
    } catch (err) {
      console.error("Profile update error:", err);
      alert(err.message || "Failed to update profile. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditForm({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      course: student.course || "",
      age: student.age || "",
      profile_pic: student.profile_pic || ""
    });
    setImageFile(null);
    setImagePreview("");
    setIsEditing(false);
  };

  // Calculate stats - simple and direct
  const calculateStats = () => {
    console.log("Calculating stats with attendance:", attendance);
    if (!attendance || attendance.length === 0) {
      return { total: 0, present: 0, absent: 0, rate: 0 };
    }

    let presentCount = 0;
    let absentCount = 0;

    attendance.forEach(record => {
      if (record.status === 'present') {
        presentCount++;
      } else if (record.status === 'absent') {
        absentCount++;
      }
    });

    const total = attendance.length;
    const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

    console.log("Stats calculated:", { total, present: presentCount, absent: absentCount, rate });
    return { total, present: presentCount, absent: absentCount, rate };
  };

  const stats = calculateStats();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <RefreshCw size={48} className="animate-spin text-[#4A4947] mx-auto mb-4" />
          <p className="text-[#4A4947] font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-[#4A4947] mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-3 bg-[#4A4947] text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
          >
            Go to Login
          </a>
        </div>
      </div>
    );

  const daysEnrolled = student?.joined_at
    ? Math.ceil((new Date() - new Date(student.joined_at)) / (1000 * 60 * 60 * 24))
    : 0;

    // Pagination helpers
const getPaginatedAttendance = () => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return attendance.slice(startIndex, endIndex);
};

const totalPages = Math.ceil(attendance.length / ITEMS_PER_PAGE);

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
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to{' '}
        <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, attendance.length)}</span> of{' '}
        <span className="font-medium">{attendance.length}</span> results
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#4A4947] text-white hover:bg-opacity-90'
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
                  ? 'bg-[#4A4947] text-white'
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
              : 'bg-[#4A4947] text-white hover:bg-opacity-90'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#4A4947] mb-2">
                Welcome back, {student?.name}!
              </h1>
              <p className="text-gray-600">Here's your learning progress overview</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
              <Clock size={20} className="text-[#4A4947]" />
              <span className="font-medium text-[#4A4947]">{daysEnrolled} days enrolled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Profile and Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                {/* Display current image, preview, or default avatar */}
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover border-4 border-gray-100"
                  />
                ) : (isEditing ? editForm.profile_pic : student?.profile_pic) ? (
                  <img
                    src={isEditing ? editForm.profile_pic : student.profile_pic}
                    alt={isEditing ? editForm.name : student.name}
                    className="w-full h-full rounded-full object-cover border-4 border-gray-100"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#4A4947] to-gray-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-100">
                    {(isEditing ? editForm.name : student?.name)?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {!isEditing ? (
                <>
                  <h2 className="text-xl font-bold text-[#4A4947] mb-2">{student?.name}</h2>
                  {student?.course && (
                    <div className="inline-block bg-[#4A4947] text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                      {student.course}
                    </div>
                  )}
                  
                  <div className="space-y-3 text-left mb-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail size={16} className="text-[#4A4947]" />
                      <span className="text-sm">{student?.email}</span>
                    </div>
                    {student?.phone && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone size={16} className="text-[#4A4947]" />
                        <span className="text-sm">{student.phone}</span>
                      </div>
                    )}
                    {student?.age && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <User size={16} className="text-[#4A4947]" />
                        <span className="text-sm">Age: {student.age}</span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-[#4A4947] text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-[#4A4947] mb-2">Profile Picture</label>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg px-4 py-6 text-center hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Upload size={24} className="text-blue-500" />
                          <span className="text-sm font-medium text-blue-700">
                            {imageFile ? 'Change Photo' : 'Upload Photo'}
                          </span>
                          <span className="text-xs text-blue-500">
                            PNG, JPG, GIF up to 5MB
                          </span>
                        </div>
                      </button>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      
                      {imageFile && (
                        <div className="text-center">
                          <p className="text-sm text-green-600 flex items-center justify-center gap-1">
                            <Image size={14} />
                            {imageFile.name}
                          </p>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <span className="text-xs text-gray-500">or</span>
                      </div>
                      
                      <input
                        type="url"
                        value={editForm.profile_pic}
                        onChange={(e) => setEditForm({...editForm, profile_pic: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A4947] focus:border-transparent text-sm"
                      />
                      <p className="text-xs text-gray-500">Enter image URL</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4947] mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A4947] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4947] mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4947] mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A4947] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4947] mb-1">Course</label>
                    <input
                      type="text"
                      value={editForm.course}
                      onChange={(e) => setEditForm({...editForm, course: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A4947] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4947] mb-1">Age</label>
                    <input
                      type="number"
                      value={editForm.age}
                      onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A4947] focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={updateProfile}
                      disabled={updateLoading}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {updateLoading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                      Save
                    </button>
                    <button 
                      onClick={handleEditCancel}
                      disabled={updateLoading}
                      className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-[#4A4947] mb-1">{stats.present}</h3>
              <p className="text-gray-600 text-sm">Days Present</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <XCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-[#4A4947] mb-1">{stats.absent}</h3>
              <p className="text-gray-600 text-sm">Days Absent</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-[#4A4947] mb-1">{stats.rate}%</h3>
              <p className="text-gray-600 text-sm">Attendance Rate</p>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Calendar className="text-[#4A4947]" size={24} />
              <h3 className="text-xl font-bold text-[#4A4947]">Attendance History</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {attendance.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No attendance records found</p>
                <p className="text-gray-400 text-sm">Your attendance will appear here once recorded</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-[#4A4947]">Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-[#4A4947]">Timing</th>
                    <th className="text-left py-4 px-6 font-semibold text-[#4A4947]">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-[#4A4947]">Session</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
  {getPaginatedAttendance().map((att, index) => (
    <tr key={att.id} className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6 font-medium text-[#4A4947]">
        {new Date(att.date).toLocaleDateString('en-US', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })}
      </td>
      <td className="py-4 px-6 text-gray-600">{att.timing}</td>
      <td className="py-4 px-6">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          att.status === 'present'
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {att.status === 'present' ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {att.status}
        </span>
      </td>
      <td className="py-4 px-6 text-gray-600">{att.session_name || "-"}</td>
    </tr>
  ))}
</tbody>
              </table>
            )}
          </div>
          {/* Pagination Controls */}
          {attendance.length > ITEMS_PER_PAGE && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="text-[#4A4947]" size={24} />
            <h3 className="text-xl font-bold text-[#4A4947]">Feedback</h3>
          </div>
          
          {feedback ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed">{feedback}</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No feedback available yet</p>
              <p className="text-gray-400 text-sm">Admin feedback will appear here when available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}