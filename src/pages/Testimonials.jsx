import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, Play, Music, X } from "lucide-react";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);

  const testimonials = [
    {
      id: 1,
      name: "Raghu Dixit",
      role: "Indian singer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Listen to Raghu Dixit speak about VN Music Academy.",
      embedId: "J2V6qO6jobk",
      thumbnail: "/thumbnails/raghu.jpg"
    },
    {
      id: 2,
      name: "Harshavardhan VS",
      role: "Grade 8, Guitar",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Learning guitar here has been an incredible journey. The teachers are so supportive and I've grown so much as a musician in just a few months.",
      embedId: "jS1QY0Z0Mkg",
      thumbnail: "/thumbnails/harsha.jpg"
    },
    {
      id: 3,
      name: "Vignesh Mani",
      role: "Singer/Songwriter",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "From a beginner to performing my own songs, this academy has transformed my musical abilities. The personalized approach really works!",
      embedId: "guWNNPGol1I",
      isShort: true,
      thumbnail: "/vignesh.png"
    },
    {
      id: 4,
      name: "Harish P",
      role: "Entrepreneur",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Even as a busy professional, I found time to learn music here. The flexible schedule and excellent teaching made it possible to pursue my passion.",
      embedId: "FGhRQ7PymNU",
      thumbnail: "/thumbnails/harish.jpg"
    },
    {
      id: 5,
      name: "Anoop Krishna",
      role: "EDM Producer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The electronic music production course opened up a whole new world for me. Now I'm creating my own tracks and living my dream!",
      embedId: "swujb8z8c20",
      isShort: true,
      thumbnail: "/anoop.png"
    }
  ];

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () =>
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));

  const VideoThumbnail = ({ testimonial, className = "", onClick }) => {
    const thumbnailUrl = testimonial.thumbnail
      ? testimonial.thumbnail
      : `https://img.youtube.com/vi/${testimonial.embedId}/maxresdefault.jpg`;

    return (
      <div className={`relative group cursor-pointer ${className}`} onClick={onClick}>
        <img
          src={thumbnailUrl}
          alt={`${testimonial.name} testimonial video`}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => (e.target.src = `https://img.youtube.com/vi/${testimonial.embedId}/hqdefault.jpg`)}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
            <Play className="w-8 h-8" style={{ color: "#4A4947" }} fill="currentColor" />
          </div>
        </div>
        {testimonial.isShort && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Short</div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 rounded-b-lg">
          <div className="text-white">
            <h4 className="font-semibold text-lg">{testimonial.name}</h4>
            <p className="text-sm opacity-90">{testimonial.role}</p>
          </div>
        </div>
      </div>
    );
  };

  const VideoEmbed = ({ embedId, isShort = false }) => (
    <div className={`relative ${isShort ? "aspect-[9/16]" : "aspect-video"} rounded-lg overflow-hidden`}>
      <iframe
        src={`https://www.youtube.com/embed/${embedId}?autoplay=1`}
        title="Student Testimonial Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Music className="w-16 h-16 mx-auto mb-6" style={{ color: "#4A4947" }} />
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: "#4A4947" }}>
            Students' Testimonials
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Listen to many of our old students who have learnt exceptionally well and transformed into amazing musicians.
          </p>
        </div>
      </div>

      {/* Featured Student */}
      <div className="py-16" style={{ backgroundColor: "#4A4947" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Music className="w-8 h-8" style={{ color: "#4A4947" }} />
                <span className="text-sm font-semibold" style={{ color: "#4A4947" }}>
                  STUDENT SUCCESS STORY
                </span>
              </div>
              <Quote className="w-12 h-12 text-gray-300 mb-6" />
              <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-6">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-gray-100"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                  <div className="flex space-x-1 mt-2">{renderStars(testimonials[currentTestimonial].rating)}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={prevTestimonial} className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-200" style={{ backgroundColor: "#f8f9fa" }}>
                  <ChevronLeft className="w-6 h-6" style={{ color: "#4A4947" }} />
                </button>
                <button onClick={nextTestimonial} className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-200" style={{ backgroundColor: "#f8f9fa" }}>
                  <ChevronRight className="w-6 h-6" style={{ color: "#4A4947" }} />
                </button>
              </div>
            </div>

            <div className="order-first lg:order-last">
              {activeVideo === currentTestimonial ? (
                <VideoEmbed embedId={testimonials[currentTestimonial].embedId} isShort={testimonials[currentTestimonial].isShort} />
              ) : (
                <VideoThumbnail
                  testimonial={testimonials[currentTestimonial]}
                  className={testimonials[currentTestimonial].isShort ? "aspect-[9/16] max-w-md mx-auto" : "aspect-video"}
                  onClick={() => setActiveVideo(currentTestimonial)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Videos */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#4A4947" }}>
              More Student Success Stories
            </h2>
            <p className="text-lg text-gray-600">Watch how our students have transformed their musical journey</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="aspect-video relative">
                  {activeVideo === `grid-${index}` ? (
                    <VideoEmbed embedId={testimonial.embedId} isShort={testimonial.isShort} />
                  ) : (
                    <VideoThumbnail
                      testimonial={testimonial}
                      className="h-full"
                      onClick={() => setActiveVideo(`grid-${index}`)}
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex space-x-1 mb-4">{renderStars(testimonial.rating)}</div>
                  <blockquote className="text-gray-700 mb-4 leading-relaxed text-sm">"{testimonial.text}"</blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm" style={{ color: "#4A4947" }}>{testimonial.role}</p>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => window.open(`https://youtube.com/watch?v=${testimonial.embedId}`, "_blank")}
                        className="inline-flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        <span>Watch on YouTube</span>
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for active video */}
      {activeVideo !== null && typeof activeVideo === "number" && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)} className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors">
              <X className="w-8 h-8" />
            </button>
            <VideoEmbed embedId={testimonials[activeVideo].embedId} isShort={testimonials[activeVideo].isShort} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
