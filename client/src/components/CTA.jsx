import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { images } from "../constants/data";

const slides = [
  {
    title: "Visit Viola's Place",
    image: images.company,
    link: "/book-us",
  },
  {
    title: "Discover Amazing Deals",
    image: images.company,
    link: "/shop",
  },
  {
    title: "Grow Your Business with SmileBaba",
    image: images.company,
    link: "/register",
  },
];

const CTA = () => {
  return (
    <section className="w-full h-[70vh] md:h-[85vh]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop
        speed={1200}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link to={slide.link} className="block h-full w-full">
              <div
                className="relative h-full w-full bg-cover bg-center flex items-center justify-center text-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>

                {/* Content */}
                <div className="relative z-10 px-6 max-w-3xl">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight">
                    {slide.title}
                  </h1>

                  {/* <div className="h-[3px] w-24 mx-auto my-6 bg-amber-400"></div> */}

                  <button
                    className="
                      px-8 py-3
                      bg-transparent border border-black
                      text-black font-semibold rounded-full mt-10
                      shadow-lg hover:scale-105 transition
                    "
                  >
                    Explore
                  </button>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CTA;
