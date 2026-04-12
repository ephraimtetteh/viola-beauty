import { motion } from "framer-motion";
import { Phone, MapPin } from "lucide-react";

export default function StudioServices() {
  const services = [
    {
      name: "Studio Glam Session By Head Artist",
      price: "GHS 750",
      desc: "Professional in-studio glam experience",
    },
    {
      name: "Studio Glam Session By Other Artist",
      price: "GHS 500",
      desc: "Professional in-studio glam experience",
    },
    {
      name: "Complexion Products Testing",
      price: "Free",
      desc: "Free when products are purchased in-store",
    },
    {
      name: "Complexion Testing & Product List",
      price: "GHS 500",
      desc: "Personalized shade matching & product guide",
    },
    {
      name: "Classes",
      price: "View Rates",
      desc: "Refer to beauty courses page",
    },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h3 className="text-sm tracking-widest text-[#d4b86a] uppercase">
            Viola’s Place
          </h3>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mt-3">
            Studio <span className="text-[#7c5546]">Services</span>
          </h1>
        </div>

        {/* CONTACT BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Phone size={16} />
            <span>0209060256</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>12A Agostinho Neto Road</span>
          </div>
        </div>

        {/* SERVICES */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-gray-800">{service.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{service.desc}</p>
              </div>
              <span className="text-[#7c5546] font-semibold">
                {service.price}
              </span>
            </motion.div>
          ))}
        </div>

        {/* NOTE */}
        <div className="mt-12 p-6 rounded-2xl bg-amber-50 border border-amber-100 text-center">
          <p className="text-sm text-gray-700">
            Kindly note that appointments are required for all studio services.
          </p>
        </div>
      </div>
    </section>
  );
}
