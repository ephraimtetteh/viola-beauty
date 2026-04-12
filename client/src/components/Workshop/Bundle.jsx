import { courses } from "../../constants/data";

const Bundle = ({ courseIndex = 4 }) => {
  const course = courses[courseIndex];

  if (!course) return null;

  return (
    <section
      className="py-24 bg-black text-white rounded-2xl"
      data-aos="fade-up"
      data-aos-duration="1200"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-semibold mb-6">{course.name}</h2>

        <p className="text-white/70 max-w-3xl mx-auto">{course.description}</p>

        <p className="text-3xl font-semibold mt-6">Price: {course.price}</p>

        <button className="mt-6 px-8 py-3 bg-white text-black rounded-full">
          Add to Cart
        </button>
      </div>

      {/* Learn Section */}
      <div className="max-w-5xl mx-auto mt-16 grid md:grid-cols-2 gap-12 px-6">
        <div>
          <h3 className="text-2xl font-semibold mb-4">What You'll Learn</h3>
          <ul className="space-y-2 text-white/70 list-disc ml-4">
            {course.lessons?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">What's Included</h3>
          <ul className="space-y-2 text-white/70 list-disc ml-4">
            {course.includes?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Bundle;
