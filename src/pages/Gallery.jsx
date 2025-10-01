import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award, Music, Camera, X, Play, BookOpen } from 'lucide-react';

const Gallery = () => {
  const [activeSection, setActiveSection] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);

  // Group Pictures Data
  const groupPictures = [
    { id: 1, src: "VN_AnnualConcert02.jpg", alt: "VN Academy Group Photo 1", title: "Annual Concert", category: "events" },
    { id: 2, src: "/VN_AnnualConcert.jpg", alt: "VN Academy Group Photo 2", title: "Annual Concert", category: "events" },
    { id: 3, src: "/VN_StudentDance (1).jpg", alt: "VN Academy Group Photo 3", title: "Student Performance", category: "performances" },
    { id: 4, src: "/E Guitars (1).jpg", alt: "VN Academy Group Photo 4", title: "Guitar Ensemble", category: "classes" },
    { id: 5, src: "/Kids Batch (2).jpg", alt: "VN Academy Group Photo 5", title: "Kids batch", category: "performances" },
    { id: 6, src: "/VN_AnnualConcert_harmonium.jpg", alt: "VN Academy Group Photo 6", title: "Annual concert", category: "events" }
  ];

  // Classes Data
  const classPictures = [
    { id: 7, src: "/Preethi_&_Nirekksha (1).jpg", alt: "Guitar Class Session", title: "Guitar Learning Session", category: "classes", date: "Ongoing" },
    { id: 8, src: "/Ahana (2).jpg", alt: "Keyboard Class", title: "Keyboard Practice", category: "classes", date: "Ongoing" }
  ];

  // Student Certificates Data
  const certificates = [
    { id: 9, src: "/Shriya.jpg", alt: "Student Certificate 1", title: "Shriya", category: "achievements" },
    { id: 10, src: "/Pranav MR.jpg", alt: "Student Certificate 2", title: "Pranav MR", category: "achievements" },
    { id: 11, src: "/Aditya Jaydeep.jpg", alt: "Student Certificate 3", title: "Aditya Jaydeep", category: "achievements" },
    { id: 12, src: "/Abheesta.jpg", alt: "Student Certificate 4", title: "Abheesta", category: "achievements" }
  ];

  const allImages = [...groupPictures, ...classPictures, ...certificates];
  
  const filterCategories = [
    { id: 'all', name: 'All', icon: Camera },
    { id: 'events', name: 'Events', icon: Music },
    { id: 'classes', name: 'Classes', icon: BookOpen },
    { id: 'performances', name: 'Performances', icon: Play },
    { id: 'achievements', name: 'Achievements', icon: Award }
  ];

  const featuredImages = groupPictures.slice(0, 4);

  // Auto-slide carousel
  useEffect(() => {
    if (autoSlide) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoSlide, featuredImages.length]);

  const filteredImages = activeSection === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === activeSection);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredImages.length) % featuredImages.length);

  const openLightbox = (image) => {
    setLightboxImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'unset';
  };

  const PlaceholderImage = ({ item, className, onClick }) => (
    <div 
      className={`${className} bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 cursor-pointer group-hover:scale-105 transition-transform duration-500`}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">
          {item.category === 'achievements' ? '🏆' : 
           item.category === 'classes' ? '🎹' : '🎵'}
        </div>
        <div className="text-sm font-medium px-4">{item.title}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden" style={{backgroundColor: '#4A4947'}}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-15 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-10 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating musical notes */}
        <div className="absolute inset-0 opacity-20 text-white">
          <div className="absolute top-20 left-20 text-4xl animate-float">♪</div>
          <div className="absolute top-40 right-32 text-3xl animate-float animation-delay-1000">♫</div>
          <div className="absolute bottom-32 left-1/4 text-5xl animate-float animation-delay-2000">♪</div>
          <div className="absolute bottom-48 right-1/4 text-3xl animate-float animation-delay-3000">♫</div>
        </div>

        <div className="relative h-full flex flex-col">
          {/* Hero Text */}
          <div className="flex-shrink-0 pt-16 pb-8 text-center text-white z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Musical Moments
            </h1>
            <p className="text-lg md:text-xl text-gray-200 animate-fade-in-delay max-w-2xl mx-auto px-4">
              Capturing unforgettable memories from our musical journey
            </p>
          </div>

          {/* Modern Carousel */}
          <div className="flex-1 flex items-center justify-center px-4 pb-16">
            <div className="w-full max-w-7xl mx-auto">
              <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20 shadow-2xl">
                {featuredImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-out ${
                      index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 via-white to-gray-50 items-center justify-center text-gray-700 hidden">
                      <div className="text-center">
                        <div className="text-8xl mb-6">🎵</div>
                        <div className="text-2xl font-bold">{image.title}</div>
                        <div className="text-lg mt-2 opacity-70">{image.date}</div>
                      </div>
                    </div>
                    
                    {/* Modern overlay with glassmorphism */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-white/30">
                          <h3 className="text-2xl md:text-4xl font-bold mb-2 text-white">{image.title}</h3>
                          <p className="text-base md:text-lg text-gray-100 mb-4">{image.date}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-200">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <span>VN Academy Collection</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Modern Carousel Controls */}
                <button
                  onClick={prevSlide}
                  onMouseEnter={() => setAutoSlide(false)}
                  onMouseLeave={() => setAutoSlide(true)}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-white/30 hover:bg-white/40 text-black p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/30 group shadow-lg"
                >
                  <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={nextSlide}
                  onMouseEnter={() => setAutoSlide(false)}
                  onMouseLeave={() => setAutoSlide(true)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-white/30 hover:bg-white/40 text-black p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/30 group shadow-lg"
                >
                  <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Modern Progress Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-3 backdrop-blur-md bg-white/20 rounded-full px-4 py-2 border border-white/30">
                    {featuredImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                          index === currentSlide ? 'w-8 h-3' : 'w-3 h-3'
                        }`}
                      >
                        <div 
                          className={`w-full h-full rounded-full transition-all duration-300 ${
                            index === currentSlide 
                              ? 'bg-white' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                          style={{
                            backgroundColor: index === currentSlide ? '#4A4947' : undefined
                          }}
                        ></div>
                        {index === currentSlide && (
                          <div 
                            className="absolute top-0 left-0 w-full h-full rounded-full animate-pulse"
                            style={{backgroundColor: '#4A4947'}}
                          ></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {filterCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveSection(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeSection === category.id
                      ? 'text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                  }`}
                  style={{
                    backgroundColor: activeSection === category.id ? '#4A4947' : undefined
                  }}
                >
                  <IconComponent size={16} />
                  <span className="text-sm md:text-base">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((item, index) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square bg-gray-200">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                    onClick={() => openLightbox(item)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <PlaceholderImage item={item} className="w-full h-full hidden" onClick={() => openLightbox(item)} />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm opacity-80">{item.date}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{backgroundColor: '#4A4947'}}
                    >
                      <Camera size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No images found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <PlaceholderImage item={lightboxImage} className="max-w-full max-h-full rounded-lg hidden" />
            
            <button
              onClick={closeLightbox}
              className="absolute -top-4 -right-4 bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X size={24} />
            </button>
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-xl font-bold mb-2">{lightboxImage.title}</h3>
              <p className="text-gray-300">{lightboxImage.date}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.5s both;
        }
      `}</style>
    </div>
  );
};

export default Gallery;
