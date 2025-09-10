const courses = [
  { title: "Guitar Basics", desc: "Learn chords, strumming, and techniques." },
  { title: "Piano Essentials", desc: "Master scales, melodies, and harmony." },
  { title: "Vocal Training", desc: "Improve pitch, tone, and range." },
];

export default function Courses() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, idx) => (
          <div key={idx} className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600">{course.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
