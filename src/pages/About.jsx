import React from "react";

const AboutUs = () => {
  return (
    <div className="font-sans text-gray-900 bg-white antialiased">
      {/* Hero Section */}
      <div className="relative bg-[#4A4947] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A4947] via-[#3a3835] to-[#2a2725] opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center py-28 px-6">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/20">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span>Established 2016</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight leading-tight">
            About <span className="font-semibold">VN Music Academy</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
            Shaping the future of music education through excellence, innovation, and dedication to artistic development.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Mission Section */}
        <div className="py-24 border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-1 bg-[#4A4947]/5 rounded-full text-xs font-semibold text-[#4A4947] uppercase tracking-wider mb-4">
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-[#4A4947] mb-6">
                Cultivating Musical <span className="font-semibold">Excellence</span>
              </h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed text-center max-w-4xl mx-auto">
             Empowering musicians, performers, and producers with expertise, future-ready tech skills, and the tools for creative and financial success in the evolving music industry.
            </p>
          </div>
        </div>

                {/* Highlight Section - Best Academy in Bangalore */}
        <div className="py-20 bg-[#4A4947] text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Best Music Academy in Bangalore 
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-white/90">
              With decades of experience, world-class mentors, and a legacy of producing top artists, 
              VN Music Academy has earned its reputation as the <span className="font-semibold">#1 destination for music education in Bangalore</span>.  
              Whether you're a beginner or a professional, we help you achieve your true musical potential.
            </p>
          </div>
        </div>


        {/* Academy Section */}
        <div className="py-24 border-b border-gray-100">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 bg-[#4A4947]/5 rounded-full text-xs font-semibold text-[#4A4947] uppercase tracking-wider">
                Legacy & Innovation
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-[#4A4947]">
                A Decades of <span className="font-semibold">Musical Heritage</span>
              </h2>
              <div className="w-16 h-0.5 bg-[#4A4947]"></div>
              <p className="text-gray-600 leading-relaxed text-base">
                Founded in 2016 by Vishal Naidruv, a composerand music producer in the Indian Film IndusFounded in 2016 by Vishal Naidruv, a composer and music producer in the Indian film industry, VN Academy has taught hundreds of students skills in music, including piano, guitar, music production, recording, songwriting, mixing, and mastering.try,VN Academy has taught hundreds of studentsskills in music, including piano, guitar, musicproduction, recording, songwriting, mixing, andmastering.
              </p>
              <p className="text-gray-600 leading-relaxed text-base">
               With over 10 years of experience, we have shaped the next generation of musicians through passionate, precise, and deeply informed training, guiding more than 100 students of all ages toward their musical goals. Our career-focused mentorship has helped over 10 learners become full-time music professionals. Under the guidance of Vishal Naidruv, an experienced music producer and composer, students gain exclusive access to his studio, production workflow, and post-production techniques—empowering them to thrive in today’s evolving music industry.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div>
                  <div className="text-3xl font-semibold text-[#4A4947]">50+</div>
                  <div className="text-sm text-gray-500 mt-1">Years</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-[#4A4947]">1000+</div>
                  <div className="text-sm text-gray-500 mt-1">Students</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-[#4A4947]">15+</div>
                  <div className="text-sm text-gray-500 mt-1">Courses</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-[#4A4947] to-[#5a5855] rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="/Batch.jpg" 
                  alt="VN Music Academy"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-[#4A4947]/20">
                  <div className="text-white text-9xl opacity-20"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col justify-center">
                <div className="text-4xl font-bold text-[#4A4947]">4.9/5</div>
                <div className="text-sm text-gray-500 mt-1">Student Rating</div>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="py-24 border-b border-gray-100">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-[#4A4947]/5 rounded-full text-xs font-semibold text-[#4A4947] uppercase tracking-wider mb-4">
              Leadership
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-[#4A4947]">
              Meet Our <span className="font-semibold">Founder</span>
            </h2>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-12 md:p-16 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-12 items-start max-w-6xl mx-auto">
              <div className="flex-shrink-0">
                <div className="w-100 h-100 rounded-lg overflow-hidden shadow-xl border-4 border-white">
                  <img 
                    src="/founder-1.png" 
                    alt="Vishal Naidruv"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-[#4A4947] to-[#5a5855] flex items-center justify-center text-8xl text-white">
                    🎸
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-[#4A4947] mb-2">Vishal Naidruv</h3>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Founder & Director</p>
                </div>
                <div className="w-16 h-0.5 bg-[#4A4947]"></div>
                <p className="text-gray-600 leading-relaxed">
                  Founder - Vishal Naidruv
Award-winning Music Composer/Producer, Programmer, Singer &
Sound Engineer with 20+ years of experience.
Worked on various Films with teams of esteemed composers -
Anirudh Ravichander, Nakul Abhyankar, Arjun Janya etc.
Highest grade - Grade 8 - Trinity College London - World’s most
renowned Music Institution
2022 - Feature film - Physics Teacher - (complete background score
and composition), official selection, Bangalore International Film
Festival.
                </p>
                {/* <p className="text-gray-600 leading-relaxed"> */}
                  {/* He founded VN Music Academy to share his expertise with the next generation of musicians. Notable achievements include collaborating with Grammy-nominated artists and producing award-winning albums. His unique approach to music education has nurtured countless talents. Under his guidance, the Academy continues to set new standards in music education, reflected by the Evergreen Experimental Band. */}
                {/* </p> */}
              </div>
            </div>
          </div>
        </div>

        {/* Awards Section */}
       <div className="py-24 border-b border-gray-100 bg-gray-50">
  <div className="text-center mb-16">
    <div className="inline-block px-4 py-1 bg-[#4A4947]/10 rounded-full text-xs font-medium text-[#4A4947] uppercase tracking-wider mb-4">
      Recognition
    </div>
    <h2 className="text-3xl md:text-4xl font-light text-[#4A4947] mb-4">
      Awards & <span className="font-semibold">Achievements</span>
    </h2>
    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
      Our dedication to excellence in music education has been consistently recognized by national and international institutions.
    </p>
  </div>

  <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
    {/* Card 1 */}
    <div className="group bg-white p-10 rounded-2xl border border-gray-200 hover:border-[#4A4947]/30 hover:shadow-lg transition-all duration-300">
      <div className="w-14 h-14 bg-[#4A4947] rounded-md flex items-center justify-center text-white mb-6">
        <span className="text-lg font-bold">IR</span>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-[#4A4947]">Industry Recognition</h3>
      <p className="text-gray-600 leading-relaxed text-sm">
        Recognized as one of the leading music academies setting benchmarks in contemporary music education.
      </p>
    </div>

    {/* Card 2 */}
    <div className="group bg-white p-10 rounded-2xl border border-gray-200 hover:border-[#4A4947]/30 hover:shadow-lg transition-all duration-300">
      <div className="w-14 h-14 bg-[#4A4947] rounded-md flex items-center justify-center text-white mb-6">
        <span className="text-lg font-bold">NR</span>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-[#4A4947]">National Recognition</h3>
      <p className="text-gray-600 leading-relaxed text-sm">
        Honored with the Award for Outstanding Contribution to Music Education by the National Music Council.
      </p>
    </div>

    {/* Card 3 */}
    <div className="group bg-white p-10 rounded-2xl border border-gray-200 hover:border-[#4A4947]/30 hover:shadow-lg transition-all duration-300">
      <div className="w-14 h-14 bg-[#4A4947] rounded-md flex items-center justify-center text-white mb-6">
        <span className="text-lg font-bold">TC</span>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-[#4A4947]">Trinity College London</h3>
      <p className="text-gray-600 leading-relaxed text-sm">
        Accredited as an official examination center, offering globally recognized music qualifications.
      </p>
    </div>
  </div>
</div>


      </div>
    </div>
  );
};

export default AboutUs;