import React from 'react';
import { Guitar, Piano, Music } from 'lucide-react';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-gray-700 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: 'url("/home-page-hero-bg.png")',
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              VN Academy of Music<br />
              & Production
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Turning Emotions into Rhythm
            </p>
            <Link to="/register">
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 text-lg font-medium hover:bg-white hover:text-gray-800 transition duration-300">
                Register Now →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide services ranging from Instruments to full fledged Songwriting & Music Production.
            </p>
            <p className="text-gray-600">Our main services are</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Guitar Service */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition duration-300">
              <div className="bg-gray-100 w-30 h-30 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                <img 
                  src="/guitar-1.png"
                  alt="Guitar Icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Guitar/ E.Guitar</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive guitar training from basics to advanced techniques
              </p>
            </div>

            {/* Piano Service */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition duration-300">
              <div className="bg-gray-100 w-30 h-30 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                <img 
                  src="/paino-1.png"
                  alt="Piano Icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Keyboard/Piano</h3>
              <p className="text-gray-600 text-sm">
                Learn piano and keyboard with professional guidance
              </p>
            </div>

            {/* Music Production Service */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition duration-300">
              <div className="bg-gray-100 w-30 h-30 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                <img 
                  src="/music-1.png"
                  alt="Music Production Icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Music Production</h3>
              <p className="text-gray-600 text-sm">
                Professional music production and recording techniques
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                About US
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2016 by <strong>Vishal Naidruv</strong>—a renowned composer and music producer in the Indian Film Industry—VN Academy has empowered hundreds of aspiring musicians with world-class training. From piano and guitar to music production, recording, songwriting, mixing, and mastering, the academy is dedicated to building strong foundations and guiding students to professional excellence in music.
              </p>
              <button className="bg-transparent border-2 border-gray-800 text-gray-800 px-6 py-2 font-medium hover:bg-gray-800 hover:text-white transition duration-300">
                View More →
              </button>
            </div>

            {/* Image Section */}
            <div className="h-80 rounded-lg overflow-hidden shadow-lg">
              <img
                src="/logo.png" 
                alt="VN Academy"
                className="w-full h-130 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Notable Students Section */}
      <section className="py-16 bg-white" style={{backgroundColor: '#4A4947'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Notable Students/Alumni</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              With 15+ years of teaching experience, There are several notable students of VN Academy
              who have directly or indirectly learned from VN Academy.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Student 1 - Kiran Kamat */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <img 
                  src="/kiran-kamat.jpg" 
                  alt="Kiran Kamat"
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex';}}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 hidden">
                  Kiran Kamat
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">Kiran Kamat</h3>
                <p className="text-sm text-gray-600">Music Producer</p>
              </div>
            </div>

            {/* Student 2 - Rajesh Sai */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <img 
                  src="/rajesh-sai.jpg" 
                  alt="Rajesh Sai"
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex';}}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 hidden">
                  Rajesh Sai
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">Rajesh Sai</h3>
                <p className="text-sm text-gray-600">Guitarist</p>
              </div>
            </div>

            {/* Student 3 - Yash Taneja */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <img 
                  src="/yash-taneja.jpg" 
                  alt="Yash Taneja"
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex';}}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 hidden">
                  Yash Taneja
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">Yash Taneja</h3>
                <p className="text-sm text-gray-600">Film Composer</p>
              </div>
            </div>

            {/* Student 4 - Vishnu */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <img 
                  src="/vishnu.jpg" 
                  alt="Vishnu"
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex';}}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 hidden">
                  Vishnu
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">Vishnu</h3>
                <p className="text-sm text-gray-600">Music Director</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#4A4947'}}>Student's Testimonials</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Hear what our students have to say about their learning journey at VN Academy.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Testimonial 1 - Harshith Bhat */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <div className="aspect-square bg-gray-200 flex items-center justify-center relative">
                <img 
                  src="/harshith-bhat.jpg" 
                  alt="Harshith Bhat"
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex';}}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 hidden">
                  Harshith Bhat
                </div>
                <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                  LIVE
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">Harshith Bhat</h3>
                <p className="text-sm text-gray-600 mt-2">
                  "The guidance and support I received at VN Academy transformed my musical journey completely."
                </p>
              </div>
            </div>

            {/* Testimonial 2 - Rohan Shetty */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <div className="aspect-square bg-gray-200 flex items-center justify-center relative">
                <img 
                  src="/rohan-shetty.jpg" 
                  alt="Rohan Shetty"
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex';}}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 hidden">
                  Rohan Shetty
                </div>
                <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                  LIVE
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">Rohan Shetty</h3>
                <p className="text-sm text-gray-600 mt-2">
                  "Learning music production here opened doors to opportunities I never imagined."
                </p>
              </div>
            </div>

            {/* Testimonial 3 - Arjun Kumar */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <div className="aspect-square bg-gray-200 flex items-center justify-center relative">
                <img 
                  src="/arjun-kumar.jpg" 
                  alt="Arjun Kumar"
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex';}}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 hidden">
                  Arjun Kumar
                </div>
                <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                  LIVE
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">Arjun Kumar</h3>
                <p className="text-sm text-gray-600 mt-2">
                  "The professional approach and personalized attention made all the difference in my learning."
                </p>
              </div>
            </div>

            {/* Testimonial 4 - Priya Nair */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <div className="aspect-square bg-gray-200 flex items-center justify-center relative">
                <img 
                  src="/priya-nair.jpg" 
                  alt="Priya Nair"
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex';}}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 hidden">
                  Priya Nair
                </div>
                <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                  LIVE
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">Priya Nair</h3>
                <p className="text-sm text-gray-600 mt-2">
                  "VN Academy provided the perfect foundation for my career in music composition."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      
    </div>
  );
};

export default Home;