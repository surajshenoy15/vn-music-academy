import React, { useState } from 'react';
import { Guitar, Piano, Music, Play, X } from 'lucide-react';
import { Link } from "react-router-dom";

const Home = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  const openVideo = (videoUrl) => {
    setActiveVideo(videoUrl);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

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
        
        {/* Link to About Page */}
        <Link to="/about">
          <button className="bg-transparent border-2 border-gray-800 text-gray-800 px-6 py-2 font-medium hover:bg-gray-800 hover:text-white transition duration-300">
            View More →
          </button>
        </Link>
      </div>

      {/* Image Section */}
      <div className="h-80 rounded-lg overflow-hidden shadow-lg">
        <img
          src="/Batch.jpg" 
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
            {/* Student Cards */}
            {[
              { name: "Nithin Kamath", role: "CEO of Zerodha", image: "/Nithin Kamath.jpg" },
              { name: "Raghu Dixit", role: "Indian Singer", image: "/Raghu_Dixit.jpg" },
              { name: "V Sridhar", role: "Film Score Composer", image: "/VSridhar.jpeg" },
              { name: "Ajay Singh", role: "Indian Politician", image: "/Ajay Singh.png" }
            ].map((student, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <img 
                    src={student.image} 
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#4A4947' }}>
              Student's Testimonials
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Hear what our students have to say about their learning journey at VN Academy.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                id: 2,
                name: "Harshavardhan VS",
                role: "Grade 8, Guitar",
                image: "harsha.png",
                text: "Learning guitar here has been an incredible journey. The teachers are so supportive and I've grown so much as a musician in just a few months.",
                embedId: "jS1QY0Z0Mkg"
              },
              {
                id: 3,
                name: "Vignesh Mani",
                role: "Singer/Songwriter",
                image: "vignesh.png",
                text: "From a beginner to performing my own songs, this academy has transformed my musical abilities. The personalized approach really works!",
                embedId: "guWNNPGol1I"
              },
              {
                id: 4,
                name: "Harish P",
                role: "Entrepreneur",
                image: "harish.png",
                text: "Even as a busy professional, I found time to learn music here. The flexible schedule and excellent teaching made it possible to pursue my passion.",
                embedId: "FGhRQ7PymNU"
              },
              {
                id: 5,
                name: "Anoop Krishna",
                role: "EDM Producer",
                image: "anoop.png",
                text: "The electronic music production course opened up a whole new world for me. Now I'm creating my own tracks and living my dream!",
                embedId: "swujb8z8c20"
              }
            ].map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
              >
                <div
                  className="aspect-square bg-gray-200 flex items-center justify-center relative cursor-pointer group"
                  onClick={() => openVideo(`https://www.youtube.com/embed/${testimonial.embedId}`)}
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-red-600 fill-red-600" />
                    </div>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 italic">{testimonial.role}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    "{testimonial.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Modal */}
        {activeVideo && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeVideo}
          >
            <div
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeVideo}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <iframe
                src={activeVideo}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
