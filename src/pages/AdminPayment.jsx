// AdminPayment.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { RefreshCw, CreditCard, Eye, Edit, X, CheckCircle, AlertCircle } from "lucide-react";

function AdminPayment() {
  const [students, setStudents] = useState([]);
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // For modals
  const [showHistory, setShowHistory] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [editingFee, setEditingFee] = useState(null);
  const [newFee, setNewFee] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .order("joined_at", { ascending: false });

      if (studentsError) throw studentsError;

      // Fetch fee records
      const { data: feeData, error: feeError } = await supabase
        .from("fee_records")
        .select("*")
        .order("created_at", { ascending: false });

      if (feeError) throw feeError;

      const studentsWithFee =
        studentsData?.map((student) => ({
          ...student,
          fee: student.fee || 5000,
        })) || [];

      setStudents(studentsWithFee);
      setFeeRecords(feeData || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  const getLatestFeeRecord = (studentId) => {
    const records = feeRecords.filter((r) => r.student_id === studentId);
    return records.length > 0 ? records[0] : null;
  };

  const getPendingFeeRecord = (studentId, totalFee) => {
    const paidRecords = feeRecords.filter(
      (r) => r.student_id === studentId && r.status === "paid"
    );
    const totalPaid = paidRecords.reduce((sum, r) => sum + r.amount, 0);
    return totalFee - totalPaid;
  };

const handlePayment = async () => {
  try {
    // 1. Create an order on your backend
    const res = await fetch("https://vn-music-academy.onrender.com/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1 }), // ₹1 for testing
    });

    const data = await res.json();
    if (!data.success) {
      alert("❌ Failed to create order: " + data.error);
      return;
    }

    const order = data.order;

    // 2. Open Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ Vite way
      amount: order.amount,
      currency: order.currency,
      name: "VN Music Academy",
      description: "Payment for Course",
      order_id: order.id,
     handler: async function (response) {
  // 1. Verify payment with backend
  const verifyRes = await fetch("https://vn-music-academy.onrender.com/api/payment/verify-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
  });

  const verifyData = await verifyRes.json();

  if (verifyData.success) {
    alert("✅ Payment successful!");

    // 2. Save record in Supabase
    const { data, error } = await supabase
      .from("fee_records")
      .insert([
        {
          student_id: selectedStudent.id,        // who paid
          total_fee: pendingAmount,              // how much
          status: "Paid",                        // mark paid
          razorpay_payment_id: response.razorpay_payment_id,
        },
      ]);

    if (error) {
      console.error("Error saving payment:", error);
      alert("⚠️ Payment verified but record not saved in DB");
    } else {
      alert("💾 Payment stored in database!");
      fetchStudents(); // refresh table
    }
  } else {
    alert("❌ Payment verification failed");
  }
},

      prefill: {
        name: "Student Name",
        email: "student@example.com",
        contact: "9876543210",
      },
      theme: { color: "#4A4947" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment error:", error);
    alert("Something went wrong. Please try again.");
  }
};




  const updateStudentFee = async (studentId, newFee) => {
    try {
      const { error } = await supabase
        .from("students")
        .update({ fee: newFee })
        .eq("id", studentId);

      if (error) throw error;

      alert("Fee updated successfully!");
      setEditingFee(null);
      fetchStudents();
    } catch (err) {
      console.error("Error updating fee:", err);
      alert("Error updating fee");
    }
  };

  const openHistory = (student) => {
    setSelectedStudent(student);
    const history = feeRecords.filter((r) => r.student_id === student.id);
    setHistoryRecords(history);
    setShowHistory(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="animate-spin text-[#4A4947]" size={24} />
          <span className="text-[#4A4947] text-lg font-medium">Loading students...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100">
          <div className="flex items-center space-x-3 text-red-600">
            <AlertCircle size={24} />
            <span className="text-lg font-medium">Error: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#4A4947]">Payment Management</h1>
              <p className="text-gray-600 mt-1">Manage student fees and payment records</p>
            </div>
            <button
              onClick={handleRefresh}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                refreshing
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#4A4947] text-white hover:bg-[#3A3835] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
              disabled={refreshing}
            >
              <RefreshCw
                size={20}
                className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-2xl font-bold text-[#4A4947] mt-1">{students.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Payments</p>
                <p className="text-2xl font-bold text-red-500 mt-1">
                  {students.filter(s => getPendingFeeRecord(s.id, s.fee) > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Fully Paid</p>
                <p className="text-2xl font-bold text-green-500 mt-1">
                  {students.filter(s => getPendingFeeRecord(s.id, s.fee) === 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Fee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pending Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => {
                  const latestPayment = getLatestFeeRecord(student.id);
                  const pendingAmount = getPendingFeeRecord(student.id, student.fee);

                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-[#4A4947]">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                          <div className="text-xs text-gray-400">{student.phone || "N/A"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.course || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {editingFee === student.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4A4947] focus:border-transparent"
                              value={newFee}
                              onChange={(e) => setNewFee(e.target.value)}
                            />
                            <button
                              onClick={() => updateStudentFee(student.id, newFee)}
                              className="px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingFee(null)}
                              className="px-3 py-2 bg-gray-400 text-white rounded-lg text-xs font-medium hover:bg-gray-500 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-[#4A4947]">₹{student.fee.toLocaleString()}</span>
                            <button
                              onClick={() => {
                                setEditingFee(student.id);
                                setNewFee(student.fee);
                              }}
                              className="p-1 text-gray-400 hover:text-[#4A4947] transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {latestPayment ? (
                          <div>
                            <div className="text-sm font-medium text-[#4A4947]">
  ₹{(latestPayment.total_fee || 0).toLocaleString()}
</div>

                           <div className={`text-xs ${latestPayment.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
  {latestPayment.status}
</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No record</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${pendingAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          ₹{pendingAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openHistory(student)}
                            className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                          >
                            <Eye size={14} className="mr-1" />
                            History
                          </button>
                          {pendingAmount > 0 ? (
                            <button
                              onClick={() => handlePayment(student, pendingAmount)}
                              className="inline-flex items-center px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                            >
                              <CreditCard size={14} className="mr-1" />
                              Pay Now
                            </button>
                          ) : (
                            <span className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                              <CheckCircle size={14} className="mr-1" />
                              Fully Paid
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment History Modal */}
      {showHistory && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-[#4A4947]">Payment History</h2>
                <p className="text-gray-600 text-sm mt-1">{selectedStudent.name}</p>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              {historyRecords.length > 0 ? (
                <div className="space-y-4">
                  {historyRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <CreditCard className="text-green-600" size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-[#4A4947]">
  ₹{(record.total_fee || 0).toLocaleString()}
</div>

                          <div className="text-sm text-gray-500">
                            {new Date(record.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
  record.status === 'Paid' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-yellow-100 text-yellow-800'
}`}>
  {record.status}
</span>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">No payment records found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPayment;