import { useState, useEffect } from "react";
import { User, MessageCircle, Send, Users, Loader2, Calendar, Mail } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function StudentsProfileDisplay() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("joined_at", { ascending: false });

      if (error) throw error;
      setStudents(data || []);

      // Fetch existing feedback for all students
      const emails = (data || []).map((s) => s.email);
      if (emails.length > 0) fetchFeedbacks(emails);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async (emails) => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("student_email, feedback")
        .in("student_email", emails);

      if (error) throw error;

      const feedbackMap = {};
      (data || []).forEach((f) => {
        feedbackMap[f.student_email] = f.feedback;
      });
      setFeedbacks(feedbackMap);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  const handleFeedbackChange = (email, value) => {
    setFeedbacks({ ...feedbacks, [email]: value });
  };

  const submitFeedback = async (email) => {
    try {
      if (!feedbacks[email] || feedbacks[email].trim() === "") {
        return;
      }

      setSubmittingFeedback({ ...submittingFeedback, [email]: true });

      const { data, error } = await supabase
        .from("feedback")
        .upsert({ student_email: email, feedback: feedbacks[email] }, { onConflict: "student_email" });

      if (error) throw error;

      // Success feedback could be added here
      console.log("Saved feedback:", data);
    } catch (err) {
      console.error("Error saving feedback:", err);
    } finally {
      setSubmittingFeedback({ ...submittingFeedback, [email]: false });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#4A4947]" />
          <p className="text-[#4A4947] text-lg font-medium">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <Users className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-[#4A4947] mb-2">Error Loading Students</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-3">
            <div className="bg-[#4A4947] rounded-2xl p-3">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#4A4947]">Students Directory</h1>
              <p className="text-gray-600 mt-1">Manage and provide feedback for your students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {students.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[#4A4947] mb-2">No Students Found</h3>
            <p className="text-gray-600">There are no students in your directory yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {students.map((student) => (
              <div key={student.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden group">
                {/* Student Header */}
                <div className="bg-gradient-to-r from-[#4A4947] to-[#5A5755] p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-white truncate">{student.name}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-4 w-4 text-white/80" />
                        <p className="text-white/90 text-sm truncate">{student.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Details */}
                <div className="p-6 space-y-4">
                  {student.joined_at && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(student.joined_at)}</span>
                    </div>
                  )}

                  {/* Feedback Section */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-[#4A4947]" />
                      <label className="text-sm font-medium text-[#4A4947]">Feedback</label>
                    </div>
                    
                    <div className="relative">
                      <textarea
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4A4947] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        rows={4}
                        value={feedbacks[student.email] || ""}
                        onChange={(e) => handleFeedbackChange(student.email, e.target.value)}
                        placeholder="Share your thoughts about this student's progress..."
                      />
                    </div>

                    <button
                      onClick={() => submitFeedback(student.email)}
                      disabled={!feedbacks[student.email]?.trim() || submittingFeedback[student.email]}
                      className="w-full bg-[#4A4947] hover:bg-[#3A3735] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                    >
                      {submittingFeedback[student.email] ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                          <span>Submit Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}