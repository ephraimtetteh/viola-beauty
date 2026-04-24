import { motion } from "framer-motion";
import { infos } from "../constants/data";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function TheCompany() {
  return (
    <section className="w-full py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p
            className="text-xs tracking-[5px] uppercase text-[#d4b86a]
            font-medium mb-4"
          >
            About
          </p>
          <h2
            className="text-4xl sm:text-5xl font-semibold text-[#1a1a1a]
            leading-tight"
          >
            The Company
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-12 bg-[#e8d9cc]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4b86a]" />
            <div className="h-px w-12 bg-[#e8d9cc]" />
          </div>
        </motion.div>

        {/* Stacked sections */}
        <div className="space-y-32">
          {infos.map((info, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="space-y-10">
                {/* Index + title */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className={`flex items-start gap-5 ${
                    isEven ? "flex-row" : "flex-row-reverse text-right"
                  }`}
                >
                  <span
                    className="text-[#d4b86a] text-xs font-medium
                    tracking-widest mt-1 flex-shrink-0"
                  >
                    0{index + 1}
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-semibold
                    text-[#1a1a1a] leading-snug"
                  >
                    {info.title}
                  </h3>
                </motion.div>

                {/* Image */}
                <motion.div
                  variants={fadeScale}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className={`w-full ${
                    isEven ? "md:w-[90%] ml-auto" : "md:w-[90%] mr-auto"
                  }`}
                >
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src={info.image}
                      alt={info.title}
                      loading="lazy"
                      className="w-full object-cover object-center
                        hover:scale-[1.02] transition-transform duration-700"
                      style={{ maxHeight: 560 }}
                    />
                  </div>
                </motion.div>

                {/* Body text */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className={`${
                    isEven
                      ? "md:pl-16 md:w-[80%]"
                      : "md:pr-16 md:w-[80%] ml-auto text-right"
                  }`}
                >
                  <p
                    className="text-gray-600 text-base sm:text-lg
                    leading-relaxed text-justify"
                  >
                    {info.subtitle}
                  </p>
                </motion.div>

                {/* Divider — not after last */}
                {index < infos.length - 1 && (
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex-1 h-px bg-[#f0e6dd]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d4b86a]" />
                    <div className="flex-1 h-px bg-[#f0e6dd]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
