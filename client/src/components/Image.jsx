import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { cardData } from "../constants/data";
import AOS from "aos";

import "swiper/css";
import "swiper/css/effect-fade";
import "aos/dist/aos.css";

const Image = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      loop
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      speed={1200}
      className="h-screen"
    >
      {cardData.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="relative h-screen w-full" data-aos="slide-up">
            {/* Image */}
            <img
              src={item.image}
              alt="slide"
              className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
              <p className="text-[20px] font-bold tracking-wide max-w-5xl">
                {item.title}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Image;
