import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { slides } from "../constants/data";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HeroSlider() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: false,
    });
  }, []);

  return (
    <section className="relative w-full h-[90vh] md:h-screen">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop
        speed={1200}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="hero-slide relative h-full w-full bg-cover bg-center md:bg-[center_30%]"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                <div data-aos="fade-up">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl  mb-5 tracking-wide leading-tight uppercase">
                    {slide.title}
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl mb-8 max-w-xl mx-auto text-white/90">
                    {slide.subtitle}
                  </p>

                  <button
                    onClick={() => navigate(slide.link)}
                    className="px-8 py-3 border border-white/80 rounded-full 
                    hover:bg-white hover:text-black 
                    transition-all duration-300 font-medium"
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
