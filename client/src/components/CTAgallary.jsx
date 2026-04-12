import { useState } from "react";
import { cardData } from "../constants/data";
import Text from "./Text";

const CTAgallary = () => {
  const [stopScroll, setStopScroll] = useState(false);

  return (
    <section className="w-full px-4">
      <Text text={"Our Works"} />

      {/* MOBILE GRID */}
      <div className="grid grid-cols-1 gap-6 md:hidden pb-16 max-w-xl mx-auto">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="relative rounded-2xl overflow-hidden group"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-[420px] object-cover"
            />

            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <p className="text-white text-lg font-semibold text-center px-4">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP MARQUEE */}
      <div
        className="hidden md:block overflow-hidden w-full relative max-w-8xl mx-auto pb-20"
        onMouseEnter={() => setStopScroll(true)}
        onMouseLeave={() => setStopScroll(false)}
      >
        {/* left fade */}
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-r from-white/30 to-transparent" />

        <div
          className="marquee-inner flex w-fit"
          style={{
            animationPlayState: stopScroll ? "paused" : "running",
            animationDuration: cardData.length * 3500 + "ms",
          }}
        >
          <div className="flex">
            {[...cardData, ...cardData].map((card, index) => (
              <div
                key={index}
                className="lg:w-[400px] w-[320px] mx-4 lg:h-[560px] h-[440px] relative group hover:scale-95 transition-all duration-300"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover rounded-2xl"
                />

                <div className="flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition absolute inset-0 backdrop-blur-md bg-black/20">
                  <p className="text-white text-lg font-semibold text-center">
                    {card.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right fade */}
        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-l from-white/30 to-transparent" />
      </div>
    </section>
  );
};

export default CTAgallary;
