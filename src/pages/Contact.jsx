import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Music, Users, Award, Star, X, AlertCircle } from 'lucide-react';

// Toast Component
const Toast = ({ message, type, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className={`fixed top-6 right-6 z-50 max-w-md w-full transform transition-all duration-500 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`border-2 rounded-xl p-4 shadow-lg backdrop-blur-sm ${getToastStyles()}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, formData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#4A4947] to-gray-800 rounded-full flex items-center justify-center mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Message</h3>
          <p className="text-gray-600">Please review your information before sending</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="text-gray-900">{formData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-900">{formData.email}</span>
          </div>
          {formData.phone && (
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Phone:</span>
              <span className="text-gray-900">{formData.phone}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Subject:</span>
            <span className="text-gray-900 capitalize">{formData.subject}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Contact Method:</span>
            <span className="text-gray-900 capitalize">{formData.preferredContact}</span>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-700 block mb-2">Message:</span>
            <p className="text-gray-900 text-sm bg-white p-3 rounded-lg border">
              {formData.message.length > 100 
                ? `${formData.message.substring(0, 100)}...` 
                : formData.message
              }
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#4A4947] to-gray-800 text-white rounded-xl font-semibold hover:from-gray-800 hover:to-[#4A4947] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Show confirmation modal
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);
    setIsLoading(true);

    try {
      // Map frontend preferredContact to backend preferred_contact
      const payload = {
        ...formData,
        preferred_contact: formData.preferredContact,
      };

      const response = await fetch("https://vn-music-academy.onrender.com/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.error || "Failed to send message");
      }

      // Success
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        preferredContact: "email"
      });

    } catch (error) {
      console.error("Error submitting form:", error);
      showToast('Something went wrong. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const stats = [
    { icon: Users, number: "500+", label: "Students Taught" },
    { icon: Music, number: "15+", label: "Instruments" },
    { icon: Award, number: "50+", label: "Achievements" },
    { icon: Star, number: "4.9/5", label: "Student Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSubmit}
        formData={formData}
      />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#4A4947] to-gray-800 text-white px-8 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Music size={18} />
            <span>VN Music Academy</span>
          </div>
          <h1 className="text-[#4A4947] text-7xl md:text-8xl font-bold mb-6 tracking-wide drop-shadow-2xl">
            LET'S MAKE MUSIC TOGETHER
          </h1>
          <p className="text-gray-600 text-xl md:text-2xl font-light leading-relaxed">
            Ready to start your musical journey? We're here to guide you every step of the way
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Our Achievements</h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#4A4947] to-gray-600 mx-auto mb-8 rounded-full"></div>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Discover why we're Bengaluru's premier music academy with our track record of success
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <div className="bg-white/90 backdrop-blur-sm p-8 border border-gray-100 rounded-2xl">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-[#4A4947] to-gray-800 p-5 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                      <stat.icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-[#4A4947] mb-3 group-hover:text-gray-800 transition-colors">{stat.number}</h3>
                    <p className="text-gray-600 font-semibold text-base">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
              <div className="mb-10">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-[#4A4947] to-gray-600 mb-6 rounded-full"></div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our friendly team would love to hear from you! Fill out the form and we'll get back to you within 2 hours.
                </p>
              </div>

              <div className="space-y-7">
                {/* Name Field */}
                <div className="space-y-3">
                  <label className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                    <Users className="text-[#4A4947] w-4 h-4" />
                    Full Name*
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A4947] focus:border-[#4A4947] transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                      <Mail className="text-[#4A4947] w-4 h-4" />
                      Email Address*
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A4947] focus:border-[#4A4947] transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                      <Phone className="text-[#4A4947] w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A4947] focus:border-[#4A4947] transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder="+91 12345 67890"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-3">
                  <label className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                    <Music className="text-[#4A4947] w-4 h-4" />
                    Subject*
                  </label>
                  <select
                    required
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A4947] focus:border-[#4A4947] bg-gray-50 focus:bg-white transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="admission">Course Admission</option>
                    <option value="pricing">Pricing Information</option>
                    <option value="trial">Free Trial Class</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Preferred Contact Method */}
                <div className="space-y-3">
                  <label className="text-gray-700 font-semibold text-sm">
                    Preferred Contact Method
                  </label>
                  <div className="flex gap-6">
                    {['email', 'phone', 'whatsapp'].map((method) => (
                      <label key={method} className="flex items-center cursor-pointer group/radio">
                        <input
                          type="radio"
                          name="preferredContact"
                          value={method}
                          checked={formData.preferredContact === method}
                          onChange={handleInputChange}
                          className="mr-2 text-[#4A4947] focus:ring-[#4A4947]"
                        />
                        <span className="text-gray-700 capitalize font-semibold group-hover/radio:text-[#4A4947] transition-colors">
                          {method}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                  <label className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                    <Send className="text-[#4A4947] w-4 h-4" />
                    Your Message*
                  </label>
                  <textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A4947] focus:border-[#4A4947] transition-all duration-300 bg-gray-50 focus:bg-white resize-vertical"
                    placeholder="Tell us about your musical interests, goals, or any questions you have..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#4A4947] to-gray-800 text-white font-bold py-4 px-6 rounded-xl hover:from-gray-800 hover:to-[#4A4947] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Contact Information and Map */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-[#4A4947] to-gray-800 p-4 rounded-2xl shadow-lg">
                      <MapPin className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">
                        VN Music Academy
                      </h3>
                      <p className="text-gray-500 text-lg">Bengaluru's Premier Music Academy</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-20 h-1.5 bg-gradient-to-r from-[#4A4947] to-gray-600 mb-6 rounded-full"></div>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#4A4947] p-3 rounded-full shadow-lg">
                        <MapPin className="text-white text-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">Visit Our Academy</h4>
                        <p className="text-gray-700 leading-relaxed text-base">
                          2550, 21st Main Rd, Siddanna Layout,<br />
                          Banashankari Stage II, Banashankari,<br />
                          Bengaluru, Karnataka 560070, India
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#4A4947] p-3 rounded-full shadow-lg">
                        <Phone className="text-white text-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">Call Us</h4>
                        <p className="text-gray-700 text-base">
                          <a href="tel:+918310986017" className="hover:text-[#4A4947] transition-colors font-semibold">
                            +91 8310-986017
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#4A4947] p-3 rounded-full shadow-lg">
                        <Mail className="text-white text-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">Email Us</h4>
                        <p className="text-gray-700 text-base">
                          <a href="mailto:vnmusicacademy.official@gmail.com" className="hover:text-[#4A4947] transition-colors font-semibold break-all">
                            vnmusicacademy.official@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#4A4947] p-3 rounded-full shadow-lg">
                        <Clock className="text-white text-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">Academy Hours</h4>
                        <div className="text-gray-700 space-y-1 text-base">
                          <p><span className="font-semibold">Mon - Fri:</span> 11:00 AM - 8:00 PM</p>
                          <p><span className="font-semibold">Saturday:</span> 10:00 AM - 1:00 PM</p>
                          <p><span className="font-semibold text-red-600">Sunday:</span> Closed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map Container */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex-1">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-700 font-semibold">Live Location</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-[#4A4947] rounded-full"></div>
                      <span>Interactive Map</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.4059!2d77.5508!3d12.9279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzQwLjQiTiA3N8KwMzMnMDIuOSJF!5e0!3m2!1sen!2sin!4v1635750000000!5m2!1sen!2sin"
                    width="100%"
                    height="400"
                    allowFullScreen=""
                    loading="lazy"
                    title="VN Music Academy Location"
                    className="w-full transition-all duration-300 group-hover:brightness-110"
                    style={{
                      border: 'none',
                      borderRadius: '0 0 1.5rem 1.5rem'
                    }}
                  ></iframe>
                  
                  {/* Map Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4A4947] rounded-full flex items-center justify-center">
                          <MapPin className="text-white text-sm" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">VN Music Academy</h4>
                          <p className="text-gray-600 text-xs">Banashankari, Bengaluru</p>
                        </div>
                      </div>
                      <a 
                        href="https://www.google.com/maps/dir/?api=1&destination=2550,+21st+Main+Rd,+Siddanna+Layout,+Banashankari+Stage+II,+Banashankari,+Bengaluru,+Karnataka+560070"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#4A4947] hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-300"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;