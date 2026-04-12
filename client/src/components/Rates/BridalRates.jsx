import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function RateCard({
  title = "The April Bride - Rates",
  subtitle,
  packages = [],
}) {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h3 className="text-sm tracking-widest text-black uppercase">
            Rate Card
          </h3>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mt-3">
            {title.split(" - ")[0]}{" "}
            <span className="text-black">Rates</span>
          </h1>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-8">
          {packages?.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition bg-white flex flex-col justify-between"
            >
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {pkg.name}
                </h2>

                <ul className="space-y-2 text-gray-600 text-sm leading-relaxed">
                  {pkg.features.map((feature, i) => (
                    <li key={i}>• {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-semibold text-black">
                  {pkg.price}
                </span>
                <Link to={'/bookings'} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="px-4 py-2 text-sm rounded-full bg-transparent border border-black text-black hover:bg-black/90 hover:text-white transition">
                  Book Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


