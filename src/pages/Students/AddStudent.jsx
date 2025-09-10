import React, { useState } from "react";
import { User, Mail, Phone, BookOpen, Calendar, Plus, CheckCircle, AlertCircle, ChevronDown, Music, Upload, X, Camera } from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function AddStudent() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    course: "",
    age: "",
    profile_pic: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);

  const courses = [
    "Guitar",
    "Piano or Keyboard", 
    "Music Production",
  ];

  const handleChange = (e) => {
    if (e.target.name === "profile_pic") {
      const file = e.target.files[0];
      setFormData({ ...formData, profile_pic: file });
      
      // Create preview URL
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setProfilePreview(null);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { firstName, lastName, email, phone, course, age, profile_pic } = formData;
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      let profilePicUrl = null;

      // Upload profile picture if provided
      if (profile_pic) {
        const fileExt = profile_pic.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `profiles/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("student-profiles")
          .upload(filePath, profile_pic);

        if (uploadError) {
          throw new Error("Upload failed: " + uploadError.message);
        }

        // Get public URL
        const { data: publicUrl } = supabase.storage
          .from("student-profiles")
          .getPublicUrl(filePath);

        profilePicUrl = publicUrl.publicUrl;
      }

      // Insert student into DB
      const { error } = await supabase.from("students").insert([
        {
          name: fullName,
          email,
          phone,
          course,
          age: age ? parseInt(age, 10) : null,
          profile_pic: profilePicUrl,
        },
      ]);

      if (error) {
        console.error("Supabase Insert Error:", error.message);
        showNotification("Error: " + error.message, "error");
        return;
      }

      showNotification("Student added successfully! 🎉", "success");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        course: "",
        age: "",
        profile_pic: null,
      });
      setProfilePreview(null);
      document.getElementById("profile_pic").value = "";
    } catch (error) {
      console.error("Unexpected Error:", error);
      showNotification("Error: " + error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseSelect = (course) => {
    setFormData((prev) => ({
      ...prev,
      course: course,
    }));
    setIsDropdownOpen(false);
  };

  const handleRemoveProfilePic = () => {
    setFormData({ ...formData, profile_pic: null });
    setProfilePreview(null);
    document.getElementById("profile_pic").value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <Plus className="w-8 h-8" style={{ color: "#4A4947" }} />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "#4A4947" }}>Add Student</h1>
          <p className="text-gray-600 mt-2">Fill in the details to register a new student</p>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center space-x-3 animate-pulse ${
              notification.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={notification.type === "success" ? "text-green-800" : "text-red-800"}>
              {notification.message}
            </span>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Profile Picture Upload Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100">
                  {profilePreview ? (
                    <img 
                      src={profilePreview} 
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Camera overlay button */}
                <label className="absolute -bottom-2 -right-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full p-2 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    id="profile_pic"
                    name="profile_pic"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>

                {/* Remove button */}
                {profilePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveProfilePic}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              <p className="text-sm text-gray-500 text-center">
                Click the camera icon to upload a profile picture
              </p>
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    placeholder="Eg: Suraj"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    placeholder="Eg: Shenoy"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  placeholder="Eg: surajshenoyp@gmail.com"
                  required
                />
              </div>
            </div>

            {/* Phone & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    placeholder="Eg: 6363783965"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    placeholder="Eg: 25"
                    min="1"
                    max="120"
                  />
                </div>
              </div>
            </div>

            {/* Course Dropdown */}
            <div className="relative z-50">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Courses <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {/* Icon inside input */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>

                {/* Dropdown trigger button */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative w-full pl-10 pr-10 py-3 text-left bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                >
                  <span className={formData.course ? "text-gray-900" : "text-gray-400"}>
                    {formData.course || "Select a course"}
                  </span>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Dropdown list - positioned outside relative container */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-[60] min-w-full">
                  <div className="py-1">
                    {courses.map((course, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleCourseSelect(course)}
                        className="w-full  px-4 py-1 text-left text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 flex items-center first:rounded-t-lg last:rounded-b-lg"
                      >
                        <Music className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                        <span className="font-medium">{course}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Click outside to close */}
              {isDropdownOpen && (
                <div
                  className="fixed inset-0 z-[55]"
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: "#4A4947" }}
              className="w-full py-4 px-6 text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding Student...</span>
                </div>
              ) : (
                "Add Student"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Need help? <span className="font-medium" style={{ color: "#4A4947" }}>Contact Support</span>
          </p>
        </div>
      </div>
    </div>
  );
}