import { instructor } from "../../constants/data";

const Instructor = () => {
  return (
    <section className="py-24 bg-neutral-100">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
        <img src={instructor.image} className="rounded-xl" />

        <div>
          <h2 className="text-4xl font-semibold">Meet Your Instructor</h2>

          <h3 className="text-xl mt-4 font-medium">{instructor.name}</h3>

          <p className="text-gray-600 mt-6 leading-relaxed">{instructor.bio}</p>
        </div>
      </div>
    </section>
  );
};

export default Instructor;
