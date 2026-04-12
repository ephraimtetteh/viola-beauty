import React from 'react'
import { motion } from "framer-motion";

export default function GlamServices() {
  const services = [
    {
      name: "Soft Glam",
      price: "GHS 1, 000",
      duration: "60 mins",
      features: [
        "Sultry neutral matte/shimmery eyes",
        "Soft clean skin",
        "Dreamy natural lashes",
      ],
    },
    {
      name: "Bold Glam",
      price: "GHS 1, 100",
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
      features: [
        "Photo-ready flawless makeup",
        "Perfect under bright lighting",
      ],
    },
    {
      name: "Baby Christening Glam",
      price: "GHS 1,500",
      duration: "90 mins",
      features: ["Custom daytime look", "Soft elegant finish for ceremonies"],
    },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h3 className="text-sm tracking-widest text-[#7c5546] uppercase">
            A Day In My Chair 2026
          </h3>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mt-3">
            Signature <span className="text-[#7c5546]">Glam Services</span>
          </h1>
        </div>

        {/* SERVICES */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
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
                <button className="px-4 py-2 rounded-full bg-[#7c5546] text-white text-sm hover:bg-[#7c5549]">
                  Book
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOOKING INFO */}
        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl border border-gray-200">
            <h2 className="font-semibold mb-3">How to Book</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• State desired date, time and venue</li>
              <li>• Choose your glam look</li>
              <li>• Send your location</li>
              <li>• Pay GHS 100 non-refundable deposit</li>
              <li>• Pay balance on appointment day</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200">
            <h2 className="font-semibold mb-3">Important Notes</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• All services are home services</li>
              <li>• Deposits are non-refundable</li>
              <li>• Availability confirms booking</li>
              <li>• Extra travel fees may apply</li>
              <li>• Early/late bookings attract extra fees</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
