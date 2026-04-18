import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const DEFAULT_SERVICES = [
  {
    name: "Soft Glam",
    price: "GHS 1,000",
    duration: "60 mins",
    features: [
      "Sultry neutral matte/shimmery eyes",
      "Soft clean skin",
      "Dreamy natural lashes",
    ],
  },
  {
    name: "Bold Glam",
    price: "GHS 1,100",
    duration: "75 mins",
    features: [
      "Bold eyes with pigments/glitters",
      "Flawless beat skin",
      "Full dramatic lashes",
    ],
  },
  {
    name: "VIP Glam",
    price: "GHS 1,500",
    duration: "90 mins",
    features: [
      "Custom glam for public figures & celebrities",
      "Long-wearing finish",
      "Perfect for stage & media appearances",
    ],
  },
  {
    name: "Celebrant Reception Glam",
    price: "GHS 1,500",
    duration: "90 mins",
    features: ["Photo-ready flawless makeup", "Perfect under bright lighting"],
  },
  {
    name: "Baby Christening Glam",
    price: "GHS 1,500",
    duration: "90 mins",
    features: ["Custom daytime look", "Soft elegant finish for ceremonies"],
  },
];

export default function GlamServices() {
  const [services, setServices] = useState(DEFAULT_SERVICES);

  useEffect(() => {
    fetch(`${API}/api/settings/rates`)
      .then((r) => r.json())
      .then((data) => {
        const glam = data?.glam;
        if (!glam?.length) return;
        setServices((prev) =>
          prev.map((svc) => {
            const match = glam.find((g) =>
              g.name
                .toLowerCase()
                .includes(svc.name.toLowerCase().split(" ")[0]),
            );
            return match ? { ...svc, price: match.price } : svc;
          }),
        );
      })
      .catch(console.error);
  }, []);

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-sm tracking-widest text-[#7c5546] uppercase">
            A Day In My Chair 2026
          </h3>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mt-3">
            Signature <span className="text-[#7c5546]">Glam Services</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-6 rounded-2xl border border-gray-200 shadow-sm
                hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {service.name}
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  Duration: {service.duration}
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {service.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <span className="text-xl font-semibold text-[#7c5546]">
                  {service.price}
                </span>
                <a href="/bookings"
                  className="px-4 py-2 rounded-full bg-[#7c5546] text-white
                  text-sm hover:bg-[#6b4a3d] transition"
                >
                  Book
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          {[
            {
              title: "How to Book",
              items: [
                "State desired date, time and venue",
                "Choose your glam look",
                "Send your location",
                "Pay GHS 100 non-refundable deposit",
                "Pay balance on appointment day",
              ],
            },
            {
              title: "Important Notes",
              items: [
                "All services are home services",
                "Deposits are non-refundable",
                "Availability confirms booking",
                "Extra travel fees may apply",
                "Early/late bookings attract extra fees",
              ],
            },
          ].map(({ title, items }) => (
            <div key={title} className="p-6 rounded-2xl border border-gray-200">
              <h2 className="font-semibold mb-3">{title}</h2>
              <ul className="text-sm text-gray-600 space-y-2">
                {items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
