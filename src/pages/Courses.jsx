import React, { useState } from 'react';
import { Music, Piano, Guitar, Headphones, ChevronRight, Star, Clock, Users } from 'lucide-react';

const courses = [
  {
    id: 'keyboard',
    title: "Keyboard/Piano",
    icon: Piano,
    subtitle: "Contemporary/Grades",
    description: "We provide comprehensive keyboard and piano training from basics to advanced levels.",
    levels: [
      {
        name: "BASICS",
        description: "This module teaches the foundational skills every beginner needs, including note reading, finger positioning, and simple melodies. You'll start with the C major scale (C, D, E, F, G, A, B) and learn basic chords like C, Dm, Em, F, G, Am, E",
        duration: "3-4 months",
        students: "150+",
        rating: 4.8
      },
      {
        name: "INTERMEDIATE", 
        description: "This module builds on the basics, introducing more complex chord progressions, two-hand coordination, and practical song applications. You'll explore full C major scale patterns, inversions, and connect scales to chords for melodies, riffs, and simple improvisation.",
        duration: "4-6 months",
        students: "120+",
        rating: 4.9
      },
      {
        name: "ADVANCED",
        description: "This module delves into advanced techniques like arpeggios, extended chords, improvisation, and advanced music theory. You'll use the C major scale across multiple octaves, experiment with modes, modulations, and expressive playing techniques to perform complex pieces.",
        duration: "6-8 months",
        students: "80+",
        rating: 4.9
      }
    ]
  },
  {
    id: 'guitar',
    title: "Guitar/E.Guitar",
    icon: Guitar,
    subtitle: "Contemporary/Grades",
    description: "Master guitar techniques from acoustic basics to electric guitar mastery.",
    levels: [
      {
        name: "BASICS",
        description: "Learn fundamental guitar skills including chord formations, strumming patterns, and basic fingerpicking. Start with open chords like G, C, D, Em, Am and simple chord progressions used in popular songs.",
        duration: "3-4 months",
        students: "200+",
        rating: 4.7
      },
      {
        name: "INTERMEDIATE",
        description: "Develop barre chords, lead guitar techniques, and rhythm patterns. Explore scale patterns, basic soloing, and song structure while building finger strength and coordination for more complex playing.",
        duration: "4-6 months", 
        students: "150+",
        rating: 4.8
      },
      {
        name: "ADVANCED",
        description: "Master advanced techniques like sweep picking, tapping, complex chord voicings, and improvisation. Study music theory application, songwriting, and performance techniques for both acoustic and electric guitar.",
        duration: "6-8 months",
        students: "90+", 
        rating: 4.9
      }
    ]
  },
  {
    id: 'production',
    title: "Music Production",
    icon: Headphones,
    subtitle: "Production & Post Production",
    description: "Learn modern music production techniques and digital audio workstation mastery.",
    levels: [
      {
        name: "BASICS",
        description: "Introduction to Digital Audio Workstations (DAW), basic recording techniques, and understanding audio fundamentals. Learn about MIDI, audio editing, and basic mixing concepts to create your first tracks.",
        duration: "2-3 months",
        students: "100+",
        rating: 4.6
      },
      {
        name: "INTERMEDIATE",
        description: "Dive deeper into mixing techniques, effects processing, and arrangement skills. Explore advanced DAW features, sound design basics, and learn to create professional-sounding demos and compositions.",
        duration: "4-5 months",
        students: "75+",
        rating: 4.8
      },
      {
        name: "ADVANCED",
        description: "Master professional mixing and mastering techniques, advanced sound design, and music business fundamentals. Learn about different genres, collaboration techniques, and prepare for industry-standard production work.",
        duration: "5-7 months",
        students: "50+",
        rating: 4.9
      }
    ]
  }
];

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-white">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-[#4A4947]">Our Courses</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We provide services ranging from Instruments to full fledged Songwriting & Music Production.
        </p>
        <p className="text-lg text-[#4A4947] font-medium mt-2">Our main services are -</p>
      </div>

      {/* Course Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {courses.map((course) => {
          const IconComponent = course.icon;
          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
              onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-[#4A4947] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-800 transition-colors">
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#4A4947] mb-2">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{course.subtitle}</p>
                <p className="text-gray-600 text-center leading-relaxed mb-6">
                  {course.description}
                </p>
                <div className="flex items-center text-[#4A4947] group-hover:text-gray-800 transition-colors">
                  <span className="font-medium">Explore Levels</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Learning Path Section */}
      {selectedCourse && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 mb-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#4A4947] mb-4">Learning Path</h3>
            <p className="text-gray-600 max-w-4xl mx-auto text-lg">
              At VN Music Academy, each course is designed as a clear Learning Path — starting from Basic, moving through Intermediate, and advancing to the Expert level. This ensures that whether you're just beginning or looking to refine your skills, you'll always find the right stage to grow in {courses.find(c => c.id === selectedCourse)?.title}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.find(c => c.id === selectedCourse)?.levels.map((level, idx) => (
              <div
                key={idx}
                className="bg-[#4A4947] rounded-2xl p-6 text-white cursor-pointer hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 group"
                onClick={() => setSelectedLevel(selectedLevel === `${selectedCourse}-${idx}` ? null : `${selectedCourse}-${idx}`)}
              >
                <h4 className="text-2xl font-bold mb-4 text-center">{level.name}</h4>
                <div className="flex items-center justify-center space-x-6 mb-4 text-sm opacity-90">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{level.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{level.students}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>{level.rating}</span>
                  </div>
                </div>
                
                {/* Always visible description with hover effect */}
                <div className="mt-6 pt-4 border-t border-gray-600 group-hover:border-gray-500 transition-colors duration-300">
                  <p className="text-gray-200 leading-relaxed group-hover:text-white transition-colors duration-300">{level.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
    </section>
  );
}