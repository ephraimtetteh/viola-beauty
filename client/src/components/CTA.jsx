import { Link } from "react-router-dom";
import { images } from "../constants/data";

const CTA = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 my-16 sm:mt-20 md:mt-24">
      <Link to="/book-us" className="block max-w-6xl mx-auto">
        <div
          className="
            relative overflow-hidden rounded-3xl
            px-6 sm:px-10 lg:px-16
            py-16 sm:py-20 lg:py-28
            text-center
            bg-cover bg-center
          "
          style={{ backgroundImage: `url(${images.company})` }}
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col items-center">
            <h1
              className="
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl
              font-semibold text-white
              max-w-2xl leading-tight
            "
            >
              Visit Viola's Place
            </h1>

            <div className="h-[3px] w-20 sm:w-24 md:w-28 my-4 bg-black "></div>

            <button
              className="
                mt-4 sm:mt-6
                px-6 sm:px-8 py-3
                text-sm sm:text-base
                bg-black hover:bg-white hover:text-black rounded-full text-white
                transition duration-300
                hover:scale-105
              "
            >
              Explore
            </button>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default CTA;
