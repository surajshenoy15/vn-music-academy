import React from 'react';
import { Link } from 'react-router-dom';
import { Music } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#4A4947] text-white">
      {/* Call to Action Section */}
      <div className="flex justify-center items-center h-3 px-4">
        <div className="bg-white text-[#4A4947] text-center w-full sm:w-auto px-6 sm:px-12 py-4 rounded-xl border-2 border-white shadow-md">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
            Ready to Master Your Music Journey?
          </h2>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between gap-8">
            {/* Company Info */}
            <div className="flex-shrink-0 w-full sm:w-auto">
   <div className="flex items-center ">
  {/* Logo Image */}
  <div className="w-60 h-20 overflow-hidden">
    <img 
      src="/logo-name-1.png"  
      alt="VN Music Academy Logo"
      className="w-full h-full object-contain"
    />
  </div>
  


    
  </div>
              <div className="text-sm leading-relaxed mb-3 ml-8 max-w-xs">
                <p>2550, 21st Main Rd, Siddanna</p>
                <p>Layout, Banashankari Stage</p>
                <p>II, Banashankari, Bengaluru,</p>
                <p>Karnataka 560070, India</p>
              </div>

              {/* Social Media Icons */}
                      <div className="flex space-x-3 ml-8">
                <a
  href="https://www.linkedin.com/company/asha-infracore/about/"  // <-- replace with your LinkedIn URL
  target="_blank"
  rel="noopener noreferrer"
  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
>
  <img
    src="/linkedin-1.png"  // <-- update with your LinkedIn icon path
    alt="LinkedIn"
    className="w-6 h-6 object-contain"
  />
</a>

                <a
                  href="mailto:kkshetty@ashainfracore.com"
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <img
                    src="/Gmail 1.png"
                    alt="Email"
                    className="w-6 h-6 object-contain"
                  />
                </a>
                <a
                  href="https://www.facebook.com/p/ASHA-Infracore-100066623525874/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <img
                    src="/Facebook 1.png"
                    alt="Facebook"
                    className="w-6 h-6 object-contain"
                  />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <h3 className="text-lg font-semibold mb-5 pt-5 sm:pt-5">
                Quick Links
              </h3>
              <ul className="space-y-1 text-sm">
                
                <li>
                  <Link to="/gallery" className="hover:text-gray-200 transition-colors">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" className="hover:text-gray-200 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-gray-200 transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-gray-200 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Our Programs */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <h3 className="text-lg font-semibold mb-5 pt-5 sm:pt-5">
                Our Programs
              </h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link to="/guitar-classes" className="hover:text-gray-200 transition-colors">
                    Guitar Classes
                  </Link>
                </li>
                <li>
                  <Link to="/piano-classes" className="hover:text-gray-200 transition-colors">
                    Piano/Keyboard
                  </Link>
                </li>
                <li>
                  <Link to="/music-production" className="hover:text-gray-200 transition-colors">
                    Music Production
                  </Link>
                </li>
                
              </ul>
            </div>

            {/* Contact Us */}
           <div className="flex-shrink-0 w-full sm:w-auto">
              <h3 className="text-lg font-semibold mb-3 pt-5 sm:pt-0 sm:ml-16">
                Contact Us
              </h3>
              <div className="text-sm mb-3 sm:ml-16">
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  className="w-60 px-5 py-2 bg-white rounded mb-2 outline-none placeholder-gray-500 text-black"
                />
              </div>
              <Link
                to="/contact-us"
                className="bg-white text-[#4A4947] px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors text-sm sm:ml-16 inline-block"
              >
                Notify Me
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#4A4947] py-4 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2025 VN Music Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;