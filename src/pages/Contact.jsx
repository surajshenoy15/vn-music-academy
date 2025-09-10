import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Music, Users, Award, Star } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        preferredContact: 'email'
      });
    }, 2000);
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
    <>
      {/* SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <title>Contact VN Music Academy | Best Music Lessons in Banashankari, Bengaluru</title>
        <meta name="description" content="Contact VN Music Academy for expert music lessons in Banashankari, Bengaluru. Call us, visit our academy, or send a message to start your musical journey today!" />
        <meta name="keywords" content="VN Music Academy contact, music lessons Banashankari, music school Bengaluru, learn music Bangalore, contact music teacher" />
        <meta property="og:title" content="Contact VN Music Academy - Premier Music Education in Bengaluru" />
        <meta property="og:description" content="Get in touch with VN Music Academy for professional music lessons. Located in Banashankari, Bengaluru. Expert instructors, flexible timings." />
        <meta name="geo.region" content="IN-KA" />
        <meta name="geo.placename" content="Banashankari, Bengaluru" />
        <meta name="geo.position" content="12.9249;77.5569" />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, #4A4947 0%, transparent 50%)`
          }}
        />
        
        {/* Floating Music Notes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce opacity-10"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            >
              <Music size={24 + i * 4} className="text-[#4A4947]" />
            </div>
          ))}
        </div>

        <div className="relative z-10 pt-20 pb-16">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-[#4A4947] text-white px-6 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
                <Music size={16} />
                <span>VN Music Academy</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-[#4A4947] mb-6 leading-tight">
                Let's Make
                <span className="block bg-gradient-to-r from-[#4A4947] to-gray-600 bg-clip-text text-transparent animate-pulse">
                  Music Together
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Ready to start your musical journey? We're here to guide you every step of the way. 
                Connect with us and discover the joy of music at Bengaluru's premier music academy.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-[#4A4947] p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-[#4A4947] mb-2">{stat.number}</h3>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <h2 className="text-3xl font-bold text-[#4A4947] mb-8">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    {/* Address Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="flex items-start space-x-4">
                        <div className="bg-[#4A4947] p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <MapPin size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#4A4947] text-lg mb-2">Visit Our Academy</h3>
                          <p className="text-gray-600 leading-relaxed">
                            2550, 21st Main Rd, Siddanna Layout,<br />
                            Banashankari Stage II, Banashankari,<br />
                            Bengaluru, Karnataka 560070, India
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="flex items-start space-x-4">
                        <div className="bg-[#4A4947] p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <Phone size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#4A4947] text-lg mb-2">Call Us</h3>
                          <p className="text-gray-600">
                            <a href="tel:+912562257" className="hover:text-[#4A4947] transition-colors">
                              +91 2562-2557
                            </a>
                          </p>
                          <p className="text-gray-600">
                            <a href="tel:+912554251" className="hover:text-[#4A4947] transition-colors">
                              +91 2554-2551
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="flex items-start space-x-4">
                        <div className="bg-[#4A4947] p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <Mail size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#4A4947] text-lg mb-2">Email Us</h3>
                          <p className="text-gray-600">
                            <a href="mailto:info@vnmusicacademy.com" className="hover:text-[#4A4947] transition-colors">
                              info@vnmusicacademy.com
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Hours Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="flex items-start space-x-4">
                        <div className="bg-[#4A4947] p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <Clock size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#4A4947] text-lg mb-2">Academy Hours</h3>
                          <div className="text-gray-600 space-y-1">
                            <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
                            <p>Sat - Sun: 10:00 AM - 6:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4A4947] to-gray-600 opacity-5 rounded-full -mr-16 -mt-16" />
                  
                  <h2 className="text-4xl font-bold text-[#4A4947] mb-8 relative">
                    Send Us a Message
                    <div className="absolute bottom-0 left-0 w-16 h-1 bg-[#4A4947] rounded-full" />
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-[#4A4947] mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4A4947] focus:ring-0 transition-all duration-300 group-hover:border-gray-300"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="group">
                        <label className="block text-sm font-semibold text-[#4A4947] mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4A4947] focus:ring-0 transition-all duration-300 group-hover:border-gray-300"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-[#4A4947] mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4A4947] focus:ring-0 transition-all duration-300 group-hover:border-gray-300"
                          placeholder="+91 12345 67890"
                        />
                      </div>
                      
                      <div className="group">
                        <label className="block text-sm font-semibold text-[#4A4947] mb-2">
                          Subject *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4A4947] focus:ring-0 transition-all duration-300 group-hover:border-gray-300"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="admission">Course Admission</option>
                          <option value="pricing">Pricing Information</option>
                          <option value="trial">Free Trial Class</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-[#4A4947] mb-2">
                        Preferred Contact Method
                      </label>
                      <div className="flex space-x-6">
                        {['email', 'phone', 'whatsapp'].map((method) => (
                          <label key={method} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="preferredContact"
                              value={method}
                              checked={formData.preferredContact === method}
                              onChange={handleInputChange}
                              className="mr-2 text-[#4A4947] focus:ring-[#4A4947]"
                            />
                            <span className="text-gray-700 capitalize">{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-[#4A4947] mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4A4947] focus:ring-0 transition-all duration-300 resize-none group-hover:border-gray-300"
                        placeholder="Tell us about your musical interests, goals, or any questions you have..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#4A4947] hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      ) : isSubmitted ? (
                        <>
                          <CheckCircle size={20} />
                          <span>Message Sent Successfully!</span>
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-center text-gray-600">
                      <span className="font-semibold text-[#4A4947]">Quick Response Guaranteed!</span><br />
                      We typically respond within 2 hours during business hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </>
  );
};

export default Contact;