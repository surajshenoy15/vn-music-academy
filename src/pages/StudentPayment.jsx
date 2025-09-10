import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Award,
  User,
  FileText,
  Download,
  Search,
  AlertCircle,
  Calendar,
  Receipt,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Supabase client - keeping exact same configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const StudentPayment = () => {
  const [student, setStudent] = useState(null);
  const [studentRecord, setStudentRecord] = useState(null);
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [stats, setStats] = useState({
    totalFee: 0,
    totalPaid: 0,
    pendingAmount: 0,
    paymentCount: 0,
  });

  // ✅ Keeping exact same fetch logic pattern from StudentAttendance
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

      setStudentRecord(studentRow);

      // Fetch fee records for this student
      const { data: feeData, error: feeError } = await supabase
        .from("fee_records")
        .select("*")
        .eq("student_id", studentRow.id)
        .order("created_at", { ascending: false });

      if (feeError) {
        console.error("❌ Fee records fetch error:", feeError);
      }

      setFeeRecords(feeData || []);
      calculateStats(studentRow, feeData || []);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
    setLoading(false);
  };

  // Calculate payment statistics
  const calculateStats = (studentData, feeData) => {
    const totalFee = studentData.fee || 5000;
    const paidRecords = feeData.filter(record => record.status === "paid");
    const totalPaid = paidRecords.reduce((sum, record) => sum + record.amount, 0);
    const pendingAmount = totalFee - totalPaid;
    const paymentCount = paidRecords.length;

    setStats({
      totalFee,
      totalPaid,
      pendingAmount: Math.max(0, pendingAmount),
      paymentCount,
    });
  };

  // Handle Razorpay payment
  const handlePayment = async (amount) => {
    if (!studentRecord) {
      alert("Student data not loaded. Please refresh the page.");
      return;
    }

    setPaymentLoading(true);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100, // Convert to paise
      currency: "INR",
      name: "Student Fee Payment",
      description: `Fee payment for ${student.name}`,
      handler: async function (response) {
        try {
          const { error } = await supabase.from("fee_records").insert([
            {
              student_id: studentRecord.id,
              amount,
              status: "paid",
              payment_id: response.razorpay_payment_id,
            },
          ]);
          
          if (error) throw error;

          alert("Payment successful! 🎉");
          fetchStudentData(); // Refresh data
        } catch (err) {
          console.error("Error saving payment:", err);
          alert("Payment completed but failed to save record. Please contact support.");
        }
      },
      prefill: {
        name: student.name,
        email: student.email,
        contact: studentRecord.phone || "",
      },
      theme: { color: "#4A4947" },
      modal: {
        ondismiss: function() {
          setPaymentLoading(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert('Payment failed. Please try again.');
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      alert("Payment gateway error. Please try again.");
      setPaymentLoading(false);
    }
  };

  // Get filtered fee records
  const getFilteredFeeRecords = () => {
    let filteredData = [...feeRecords];

    // Filter by search term (payment ID or amount)
    if (searchTerm) {
      filteredData = filteredData.filter(record => 
        record.payment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.amount.toString().includes(searchTerm)
      );
    }

    // Filter by type
    const currentDate = new Date();
    if (filterType === 'weekly') {
      const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      filteredData = filteredData.filter(record => new Date(record.created_at) >= weekStart);
    } else if (filterType === 'monthly') {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      filteredData = filteredData.filter(record => new Date(record.created_at) >= monthStart);
    }

    return filteredData;
  };

  // Export to CSV
  const exportToCSV = () => {
    const filteredData = getFilteredFeeRecords();
    const csvContent = [
      ['Date', 'Amount', 'Status', 'Payment ID'],
      ...filteredData.map(record => [
        new Date(record.created_at).toLocaleDateString(),
        record.amount,
        record.status,
        record.payment_id || 'N/A'
      ])
    ];

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  // Helper functions
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const getStatusBadge = (status) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${
      status === "paid"
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800"
    }`}>
      {status === "paid" ? (
        <CheckCircle size={12} />
      ) : (
        <Clock size={12} />
      )}
      {status}
    </span>
  );

  const filteredFeeRecords = getFilteredFeeRecords();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A4947] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100">
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#4A4947] flex items-center gap-3">
                <div className="bg-[#4A4947] p-3 rounded-xl">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                My Payment Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                {student.name} • {student.email}
              </p>
              <p className="text-sm text-gray-500">
                Course: {studentRecord?.course || "Not specified"}
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-[#4A4947] text-white px-6 py-3 rounded-xl hover:bg-[#3A3835] transition-colors flex items-center gap-2 shadow-lg"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fee</p>
                <p className="text-2xl font-bold text-[#4A4947] mt-1">₹{stats.totalFee.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600 mt-1">₹{stats.totalPaid.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-red-500 mt-1">₹{stats.pendingAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payments Made</p>
                <p className="text-2xl font-bold text-[#4A4947] mt-1 flex items-center gap-2">
                  {stats.paymentCount}
                  {stats.pendingAmount === 0 && <Award className="w-5 h-5 text-yellow-500" />}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Receipt className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Action Card */}
        {stats.pendingAmount > 0 && (
          <div className="bg-gradient-to-r from-[#4A4947] to-[#3A3835] rounded-2xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Outstanding Payment</h3>
                <p className="text-gray-200 mb-4">
                  You have a pending amount of ₹{stats.pendingAmount.toLocaleString()} to complete your course fee.
                </p>
                <div className="flex items-center text-sm text-gray-300">
                  <Clock size={16} className="mr-2" />
                  Pay now to continue your learning journey
                </div>
              </div>
              <button
                onClick={() => handlePayment(stats.pendingAmount)}
                disabled={paymentLoading}
                className={`px-8 py-4 bg-white text-[#4A4947] rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg ${
                  paymentLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <CreditCard size={20} />
                {paymentLoading ? 'Processing...' : `Pay ₹${stats.pendingAmount.toLocaleString()}`}
              </button>
            </div>
          </div>
        )}

        {/* Success Message for Fully Paid */}
        {stats.pendingAmount === 0 && stats.totalPaid > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">Payment Complete! 🎉</h3>
                <p className="text-green-700">
                  Congratulations! You have successfully completed all your fee payments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A4947] focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A4947] focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>

            <div className="flex items-center text-sm text-gray-600">
              <FileText size={16} className="mr-2" />
              Showing {filteredFeeRecords.length} of {feeRecords.length} records
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#4A4947] flex items-center gap-3">
              <Receipt className="h-5 w-5 text-gray-600" />
              Payment History ({filteredFeeRecords.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredFeeRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-[#4A4947]">
                        <Calendar size={14} />
                        {formatDate(record.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-[#4A4947]">
                        ₹{record.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 font-mono">
                        {record.payment_id || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredFeeRecords.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No payment records found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your filters or search term.'
                    : 'Your payment history will appear here once you make payments.'
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

export default StudentPayment;