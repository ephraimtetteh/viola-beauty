import { useEffect } from "react";
import { cardData } from "../constants/data";
import AOS from "aos";
import "aos/dist/aos.css";
import WorkshopEducation from "../components/WorkshopComponent";
import UpcomingClasses from "../components/education/UpcomingClasses";
import { motion } from "framer-motion";

const Education = () => {
  useEffect(() => {
    AOS.init({ duration: 2000, easing: "ease-in-out", once: false });
  }, []);

  return (
    <div className="flex flex-col">
      <WorkshopEducation />

      {/* Upcoming live classes */}
      <UpcomingClasses />

      <div className="py-30 px-3 md:px-6 lg:px-12 xl:px-12">
        <div className="flex flex-col lg:mt-40">
          <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
            A visual collection of our most recent works — each piece crafted
            with intention, emotion, and style.
          </p>
          <div
            className="flex flex-wrap items-center justify-center mt-12
            gap-4 max-w-7xl mx-auto"
          >
            {cardData.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative group rounded-lg overflow-hidden"
              >
                <img
                  src={card.image}
                  alt="image"
                  className="w-72 h-72 object-cover object-top transition-transform
                    duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-4
                  text-white bg-black/50 opacity-0 group-hover:opacity-100
                  transition-all duration-300"
                >
                  <h1 className="text-xl font-medium">{card.title}</h1>
                  <a
                    href="#"
                    className="flex items-center gap-1 text-sm text-white/70"
                  >
                    Show More
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
