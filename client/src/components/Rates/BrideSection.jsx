import { motion } from "framer-motion";

export default function BrideSection({
  title,
  description,
  features = [],
  image,
  reverse = false,
}) {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid lg:grid-cols-2 gap-10 items-center ${
            reverse ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={image}
              alt={title}
              className="w-full h-[450px] sm:h-[780px] lg:h-[600px] object-cover"
            />
          </motion.div>

          {/* CONTENT */}
          <div className="space-y-6">
            <h3 className="text-sm tracking-widest text-black uppercase">
              Bridal Package
            </h3>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              {title.split(" ")[0]}{" "}
              <span className="text-[#7c5546]">
                {title.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            <p className="text-gray-500 leading-relaxed">{description}</p>

            {/* FEATURES */}
            <div className="space-y-3">
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex gap-3 items-start"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-black" />
                  <p className="text-gray-700 text-sm sm:text-base">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
