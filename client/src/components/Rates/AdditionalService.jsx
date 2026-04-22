import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const DEFAULT_SERVICES = [
  {
    title: "Bridesmaid Glam (By Other Artist)",
    price: "GHS 800 per head",
    note: "GHS 750 per head for 4 or more",
  },
  { title: "Civil Wedding", price: "GHS 3,000", note: null },
  { title: "Sunday Thanksgiving Glam", price: "GHS 2,000", note: null },
  {
    title: "Mother of the Bride (By Head Artist)",
    price: "GHS 1,000",
    note: null,
  },
];

const whatYouGet = [
  "Personalized skin prep guide",
  "Professional recommendations for your full glam look",
  "Guidance on hairstyles and accessories to complement your makeup",
  "In-depth understanding of your skin type and needs",
];

const serviceDetails = [
  "Conducted in-studio",
  "Home service available at an additional travel fee",
  "Can double as bridal shower or pre-wedding shoot glam",
];

export default function AdditionalServices() {
  const [services, setServices] = useState(DEFAULT_SERVICES);

  useEffect(() => {
    fetch(`${API}/api/settings/rates`)
      .then((r) => r.json())
      .then((data) => {
        const bridal = data?.bridal;
        if (!bridal?.length) return;
        setServices((prev) =>
          prev.map((svc) => {
            const match = bridal.find((b) =>
              b.name
                .toLowerCase()
                .includes(svc.title.toLowerCase().split(" ")[0]),
            );
            return match ? { ...svc, price: match.price } : svc;
          }),
        );
      })
      .catch(console.error);
  }, []);

  return (
    <section className="w-full py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[4px] uppercase text-[#d4b86a] font-medium mb-3">
            Additional Services
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold">
            Trial & <span className="text-[#7c5546]">Consultation</span>
          </h1>
          <p className="text-gray-500 mt-2 max-w-3xl mx-auto leading-relaxed text-sm">
            This service allows you to preview your desired glam look while
            creating a personal connection between you and the artist. It helps
            us understand your skin type, complexion, and any special conditions
            needed for the perfect bridal finish.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-5">
            {[
              { heading: "What You Get", items: whatYouGet },
              { heading: "Service Details", items: serviceDetails },
            ].map(({ heading, items }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md
                  transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="font-semibold text-[#1a1a1a] mb-4">
                    {heading}
                  </h2>
                  <ul className="space-y-2.5">
                    {items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-[#d4b86a] mt-0.5 flex-shrink-0">
                          ✦
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md
                  transition-all duration-300 overflow-hidden"
              >
                <div className="flex justify-between items-start p-5 gap-4">
                  <div>
                    <p className="font-medium text-[#1a1a1a] text-sm">
                      {service.title}
                    </p>
                    {service.note && (
                      <p className="text-xs text-gray-400 mt-1">
                        {service.note}
                      </p>
                    )}
                  </div>
                  <span className="text-[#7c5546] font-bold text-base flex-shrink-0">
                    {service.price}
                  </span>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-[#fdf6e3] border border-[#d4b86a]/40 rounded-2xl p-4"
            >
              <p className="text-xs text-[#7c5546] leading-relaxed">
                <span className="font-semibold">Note:</span> All prices are
                subject to change based on location, number of persons, and
                specific requirements. Contact us for a custom quote.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
