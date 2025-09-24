import React from 'react';
import { Link } from 'react-router-dom';

const Gallery = () => {
  // Group Pictures Data
  const groupPictures = [
    {
      id: 1,
      src: "/gallery/group-1.jpg",
      alt: "VN Academy Group Photo 1",
      title: "Annual Concert 2023"
    },
    {
      id: 2,
      src: "/gallery/group-2.jpg",
      alt: "VN Academy Group Photo 2",
      title: "Music Workshop"
    },
    {
      id: 3,
      src: "/gallery/group-3.jpg",
      alt: "VN Academy Group Photo 3",
      title: "Student Performance"
    },
    {
      id: 4,
      src: "/gallery/group-4.jpg",
      alt: "VN Academy Group Photo 4",
      title: "Guitar Ensemble"
    },
    {
      id: 5,
      src: "/gallery/group-5.jpg",
      alt: "VN Academy Group Photo 5",
      title: "Piano Recital"
    },
    {
      id: 6,
      src: "/gallery/group-6.jpg",
      alt: "VN Academy Group Photo 6",
      title: "Academy Group Photo"
    }
  ];

  // Classes Data
  const classPictures = [
    {
      id: 1,
      src: "/gallery/class-1.jpg",
      alt: "Piano Class Session",
      title: "Piano Learning Session"
    },
    {
      id: 2,
      src: "/gallery/class-2.jpg",
      alt: "Keyboard Class",
      title: "Keyboard Practice"
    }
  ];

  // Student Certificates Data
  const certificates = [
    {
      id: 1,
      src: "/gallery/certificate-1.jpg",
      alt: "Student Certificate 1",
      studentName: "Arjun Kumar"
    },
    {
      id: 2,
      src: "/gallery/certificate-2.jpg",
      alt: "Student Certificate 2",
      studentName: "Priya Sharma"
    },
    {
      id: 3,
      src: "/gallery/certificate-3.jpg",
      alt: "Student Certificate 3",
      studentName: "Rahul Nair"
    },
    {
      id: 4,
      src: "/gallery/certificate-4.jpg",
      alt: "Student Certificate 4",
      studentName: "Sneha Patel"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-24" style={{backgroundColor: '#4A4947'}}>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        
        {/* Musical Notes Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="text-9xl font-bold transform rotate-12">♪</div>
          <div className="text-6xl font-bold transform -rotate-12 ml-8">♫</div>
          <div className="text-7xl font-bold transform rotate-45 ml-12">♪</div>
          <div className="text-5xl font-bold transform -rotate-45 ml-6">♫</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Musical Moments
          </h1>
          <p className="text-xl md:text-2xl text-gray-200">
            Capturing unforgettable moments from classes, workshops & concerts
          </p>
        </div>
      </section>

      {/* Group Pictures Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#4A4947'}}>
              Group Pictures
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groupPictures.map((picture) => (
              <div key={picture.id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  <img
                    src={picture.src}
                    alt={picture.alt}
                    className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-64 md:h-80 bg-gray-300 flex items-center justify-center text-gray-600 hidden">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎵</div>
                      <div>{picture.title}</div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg">{picture.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#4A4947'}}>
              Classes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {classPictures.map((picture) => (
              <div key={picture.id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-gray-200">
                  <img
                    src={picture.src}
                    alt={picture.alt}
                    className="w-full h-64 md:h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-64 md:h-72 bg-gray-300 flex items-center justify-center text-gray-600 hidden">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎹</div>
                      <div>{picture.title}</div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg">{picture.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Certificates Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#4A4947'}}>
              Student Certificates
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-gray-200">
                  <img
                    src={certificate.src}
                    alt={certificate.alt}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-600 hidden">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏆</div>
                      <div className="text-sm px-2">{certificate.studentName}</div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <h3 className="text-white font-semibold text-sm text-center">{certificate.studentName}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Gallery;