import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { slides as defaultSlides } from "../constants/data";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const API = import.meta.env.VITE_API_URL;

export default function HeroSlider() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    fetch(`${API}/api/settings/hero_slides`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data) || !data.length) return;
        // Merge API text with local images as fallback
        setSlides(
          data.map((s, i) => ({
            ...defaultSlides[i],
            ...s,
            image: s.image || defaultSlides[i]?.image,
          })),
        );
      })
      .catch(console.error);
  }, []);

  return (
    <section className="relative w-full h-[90vh] md:h-screen">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop
        speed={1200}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-t
                from-black/60 via-black/20 to-black/10"
              />

              <div
                className="absolute inset-0 flex flex-col items-center
                justify-center text-center text-white px-6 pt-16"
              >
                <div data-aos="fade-up">
                  <h1
                    className="text-3xl sm:text-4xl md:text-6xl mb-5
                    tracking-wide leading-tight uppercase font-semibold"
                  >
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p
                      className="text-base sm:text-lg md:text-xl mb-8
                      max-w-xl mx-auto text-white/90"
                    >
                      {slide.subtitle}
                    </p>
                  )}
                  <button
                    onClick={() => navigate(slide.link)}
                    className="px-8 py-3 border border-white/80 rounded-full
                      hover:bg-white hover:text-black transition-all duration-300"
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
