import React from "react";
import { images} from "../constants/data";
import { Link } from "react-router-dom";

const courses = [
  {
    title: "Complexion Techniques",
    description:
      "Learn the essential skin preparation techniques that create a smooth and long-lasting glam base.",
    image: images.course1,
  },
  {
    title: "Skin Prep",
    description:
      "Master seamless eyeshadow blending techniques to create elegant and timeless soft glam looks.",
    image: images.course2,
    price: 130,
    url: "",
  },
  {
    title: "Brow Mapping",
    description:
      "Discover the subtle detailing and finishing techniques that define the Viola Beauty finish.",
    image: images.course3,
    price: 130,
    url: "",
  },
];

const Courses = () => {
  return (
    <section className="bg-[#fff8f5] py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* HEADER */}
        <button className="bg-transparent text-sm text-[#d4b86a] px-6 py-2.5 rounded-full">
          The Signature Glam Series
        </button>

        {/* <h2 className="text-black font-medium text-3xl md:text-4xl mt-6 max-w-2xl mx-auto">
          A refined, contemporary approach to soft glam and bridal beauty
        </h2> */}

        <p className="text-base text-black/60 max-w-3xl mt-3 mx-auto">
          Learn at your pace. Master your finish. Show up boldly.
        </p>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {courses.map((course, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl"
            >
              <img
                src={course.image}
                alt={course.title}
                className="h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-left">
                <h3 className="text-white text-xl font-semibold mb-2">
                  {course.title}
                </h3>

                {/* <p className="text-white/80 text-sm">{course.description}</p> */}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link to={'/courses'}
         
         onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
         className="inline-block bg-black  border hover:border-black hover:bg-transparent transition text-sm text-white hover:text-black px-8 py-3 rounded-full mt-12"
       >
         Explore
       </Link>
      </div>
    </section>
  );
};

export default Courses;
