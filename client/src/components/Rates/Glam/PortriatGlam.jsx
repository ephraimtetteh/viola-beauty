import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const DEFAULT_SERVICES = [
  {
    name: "Essentials",
    price: "GHS 1,000",
    duration: "75 mins",
    features: [
      "Custom photo-ready full face glam",
      "Perfect for birthdays, graduations, maternity shoots",
      "Includes two looks with outfit change",
    ],
  },
  {
    name: "Prestige",
    price: "GHS 2,000",
    duration: "6 hours",
    features: [
      "Premium custom glam experience",
      "Extended session for multiple looks",
      "Perfect for high-end shoots",
    ],
  },
  {
    name: "Half Day",
    price: "GHS 4,000",
    duration: "6 hours",
    features: [
      "Custom photo-ready glam",
      "Ideal for personal & business branding",
      "Flexible styling within session",
    ],
  },
  {
    name: "Family Glam",
    price: "GHS 4,000",
    duration: "Varies",
    features: [
      "Custom soft/full glam for family photos",
      "Covers up to five persons",
      "Flexible pricing based on group size",
    ],
  },
];

export default function EssentialsServices() {
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
            Essentials & Campaigns
          </h3>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mt-3">
            Portraits <span className="text-[#7c5546]">Glam</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <span className="text-xl font-semibold text-black">
                  {service.price}
                </span>
                <a href="/bookings"
                  className="px-4 py-2 rounded-full bg-transparent text-black
                  border border-black hover:bg-black hover:text-white text-sm transition"
                >
                  Book
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-amber-50 border border-amber-100 text-center">
          <h2 className="text-xl font-semibold mb-3">
            Business / Brand Campaigns
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
            Kindly send your campaign briefs and mood boards to{" "}
            <span className="font-medium">shopviolabeauty@gmail.com</span> or
            WhatsApp <span className="font-medium">+233209060256</span> for a
            custom quote.
          </p>
        </div>
      </div>
    </section>
  );
}
